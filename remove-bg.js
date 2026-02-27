const { Jimp } = require('jimp');

async function removeBackground() {
    const image = await Jimp.read('./logo.png');
    const threshold = 210; // pixels brighter than this are treated as background

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        // If pixel is light grey or white (the checkered background), make transparent
        if (r > threshold && g > threshold && b > threshold) {
            this.bitmap.data[idx + 3] = 0; // set alpha to 0 (transparent)
        }
    });

    await image.write('./logo.png');
    console.log('Background removed successfully!');
}

removeBackground().catch(console.error);
