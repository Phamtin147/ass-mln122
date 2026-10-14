import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { CompilerBase } from './node_modules/mind-ar/src/image-target/compiler-base.js';
import { buildImageList, buildTrackingImageList } from './node_modules/mind-ar/src/image-target/image-list.js';
import { extractTrackingFeatures } from './node_modules/mind-ar/src/image-target/tracker/extract-utils.js';
import './node_modules/mind-ar/src/image-target/detector/kernels/cpu/index.js';

class PureCompiler extends CompilerBase {
  compileTrack({ progressCallback, targetImages, basePercent }) {
    return new Promise((resolve) => {
      const percentPerImage = (100 - basePercent) / targetImages.length;
      let percent = 0;
      const list = [];
      for (let i = 0; i < targetImages.length; i++) {
        const targetImage = targetImages[i];
        const imageList = buildTrackingImageList(targetImage);
        const percentPerAction = percentPerImage / imageList.length;

        const trackingData = extractTrackingFeatures(imageList, () => {
          percent += percentPerAction;
          if (progressCallback) progressCallback(basePercent + percent);
        });
        list.push(trackingData);
      }
      resolve(list);
    });
  }

  // Pure JS image loader avoiding Canvas dependency
  async compilePureImages(imagesData, progressCallback) {
    const targetImages = imagesData.map(img => {
      const greyImageData = new Uint8Array(img.width * img.height);
      for (let i = 0; i < greyImageData.length; i++) {
        const offset = i * 4;
        greyImageData[i] = Math.floor((img.data[offset] + img.data[offset + 1] + img.data[offset + 2]) / 3);
      }
      return { data: greyImageData, height: img.height, width: img.width };
    });

    const dummyImages = targetImages.map((t, idx) => ({
      width: t.width,
      height: t.height,
      rawIndex: idx
    }));

    this.createProcessCanvas = (dummyImg) => {
      const rgbaData = imagesData[dummyImg.rawIndex].data;
      return {
        getContext: () => ({
          drawImage: () => {},
          getImageData: () => ({ data: rgbaData })
        })
      };
    };

    return await this.compileImageTargets(dummyImages, progressCallback);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node compile-cli.mjs <output.mind> <img1> [img2] ...');
    process.exit(1);
  }

  const outputPath = args[0];
  const inputPaths = args.slice(1);

  console.log(`Compiling ${inputPaths.length} target images into: ${outputPath}`);
  const decodedList = [];
  for (const imgPath of inputPaths) {
    console.log(`- Reading: ${imgPath}`);
    const rawBytes = fs.readFileSync(imgPath);
    let decoded;
    if (imgPath.endsWith('.png')) {
      decoded = PNG.sync.read(rawBytes);
    } else {
      decoded = jpeg.decode(rawBytes);
    }
    console.log(`  Dimensions: ${decoded.width}x${decoded.height}`);
    decodedList.push(decoded);
  }

  const compiler = new PureCompiler();
  console.log('Extracting feature points for all targets...');
  let lastP = 0;
  await compiler.compilePureImages(decodedList, (progress) => {
    const p = Math.floor(progress);
    if (p >= lastP + 10) {
      console.log(`Overall Progress: ${p}%`);
      lastP = p;
    }
  });

  const buffer = compiler.exportData();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`DONE! Successfully compiled ${inputPaths.length} targets to ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('Error during compilation:', err);
  process.exit(1);
});
