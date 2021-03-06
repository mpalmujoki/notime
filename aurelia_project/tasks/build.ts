import * as gulp from 'gulp';
import transpile from './transpile';
import transpileElectronApp from './transpileElectronApp';
import processMarkup from './process-markup';
import processCSS from './process-css';
import { build } from 'aurelia-cli';
import prepareFontAwesome from './prepare-fonts';
import * as project from '../aurelia.json';

export default gulp.series(
  readProjectConfiguration,

  gulp.parallel(
    transpile,
    transpileElectronApp,
    processMarkup,
    processCSS,
    prepareFontAwesome
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
