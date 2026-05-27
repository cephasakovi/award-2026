import sharp from "sharp";

function isNearAnySample(r, g, b, samples, threshold) {
  return samples.some((sample) => {
    const distance =
      Math.abs(r - sample[0]) +
      Math.abs(g - sample[1]) +
      Math.abs(b - sample[2]);
    return distance <= threshold * 3;
  });
}

async function removeBackgroundFromEdges(inputPath, outputPath, threshold = 40) {
  const { data, info } = await sharp(inputPath)
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const output = Buffer.from(data);
  const queue = [];
  let head = 0;
  const visited = new Uint8Array(width * height);

  const getIndex = (x, y) => y * width + x;
  const getOffset = (x, y) => getIndex(x, y) * channels;

  const cornerOffsets = [
    getOffset(0, 0),
    getOffset(width - 1, 0),
    getOffset(0, height - 1),
    getOffset(width - 1, height - 1),
  ];

  const samples = cornerOffsets.map((offset) => [
    output[offset],
    output[offset + 1],
    output[offset + 2],
  ]);

  for (let x = 0; x < width; x += 1) {
    queue.push([x, 0], [x, height - 1]);
  }

  for (let y = 0; y < height; y += 1) {
    queue.push([0, y], [width - 1, y]);
  }

  while (head < queue.length) {
    const [x, y] = queue[head++];
    const pixelIndex = getIndex(x, y);

    if (visited[pixelIndex]) {
      continue;
    }

    visited[pixelIndex] = 1;
    const offset = getOffset(x, y);
    const r = output[offset];
    const g = output[offset + 1];
    const b = output[offset + 2];

    if (!isNearAnySample(r, g, b, samples, threshold)) {
      continue;
    }

    output[offset + 3] = 0;

    if (x > 0) queue.push([x - 1, y]);
    if (x < width - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < height - 1) queue.push([x, y + 1]);
  }

  await sharp(output, {
    raw: {
      width,
      height,
      channels,
    },
  })
    .png()
    .toFile(outputPath);
}

await removeBackgroundFromEdges(
  "public/awards-logo.png",
  "public/awards-logo-transparent.png",
  28,
);

await removeBackgroundFromEdges(
  "public/trophy.jpg",
  "public/trophy-transparent.png",
  52,
);
