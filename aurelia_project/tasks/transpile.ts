import { CLIOptions, build } from 'aurelia-cli';
import * as changedInPlace from 'gulp-changed-in-place';
import * as eventStream from 'event-stream';
import * as gulp from 'gulp';
import * as notify from 'gulp-notify';
import * as plumber from 'gulp-plumber';
import * as project from '../aurelia.json';
import * as rename from 'gulp-rename';
import * as sourcemaps from 'gulp-sourcemaps';
import * as ts from 'gulp-typescript';

function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.ts`)
    .pipe(changedInPlace({firstPass:true}))
    .pipe(rename('environment.ts'))
    .pipe(gulp.dest(project.paths.root));
}

var typescriptCompiler = typescriptCompiler || null;

function buildTypeScript() {
  if(!typescriptCompiler) {
    typescriptCompiler = ts.createProject('tsconfig.json', {
      "typescript": require('typescript')
    });
  }

  let dts = gulp.src(project.transpiler.dtsSource);

  let src = gulp.src(project.transpiler.source)
    .pipe(changedInPlace({firstPass: true}));

  return eventStream.merge(dts, src)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(typescriptCompiler())
    .pipe(build.bundle());
}

export default gulp.series(
  configureEnvironment,
  buildTypeScript
);
