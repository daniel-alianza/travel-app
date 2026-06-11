const ODOMETER_IMAGE_MAX_INPUT_BYTES = 10 * 1024 * 1024;
const ODOMETER_IMAGE_MAX_DIMENSION = 1600;
const ODOMETER_IMAGE_OUTPUT_MAX_BYTES = 800_000;
const ODOMETER_IMAGE_MIN_QUALITY = 0.5;
const ODOMETER_IMAGE_INITIAL_QUALITY = 0.85;

export type CompressOdometerImageErrorCode =
  | 'INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'LOAD_FAILED'
  | 'CANVAS_UNAVAILABLE';

export class CompressOdometerImageError extends Error {
  readonly code: CompressOdometerImageErrorCode;

  constructor(code: CompressOdometerImageErrorCode) {
    super(code);
    this.code = code;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new CompressOdometerImageError('LOAD_FAILED'));
    image.src = src;
  });
}

function scaleDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const ratio = Math.min(maxDimension / width, maxDimension / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function estimateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.ceil((base64.length * 3) / 4);
}

export async function compressOdometerImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new CompressOdometerImageError('INVALID_TYPE');
  }

  if (file.size > ODOMETER_IMAGE_MAX_INPUT_BYTES) {
    throw new CompressOdometerImageError('FILE_TOO_LARGE');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = scaleDimensions(
      image.width,
      image.height,
      ODOMETER_IMAGE_MAX_DIMENSION,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (context === null) {
      throw new CompressOdometerImageError('CANVAS_UNAVAILABLE');
    }

    context.drawImage(image, 0, 0, width, height);

    let quality = ODOMETER_IMAGE_INITIAL_QUALITY;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);

    while (
      estimateBase64Bytes(dataUrl) > ODOMETER_IMAGE_OUTPUT_MAX_BYTES &&
      quality > ODOMETER_IMAGE_MIN_QUALITY
    ) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
