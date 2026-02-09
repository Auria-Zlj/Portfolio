// Utility to generate procedural noise texture
export function generateNoiseTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Generate random noise pixels
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.random() * 255;
        imageData.data[i] = value;     // R
        imageData.data[i + 1] = value; // G
        imageData.data[i + 2] = value; // B
        imageData.data[i + 3] = 255;   // A
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas;
}
