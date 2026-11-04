const common = {
  paths: ['features/**/*.feature'],
  require: ['features/support/**/*.js', 'features/step_definitions/**/*.js'],
  publish: false,
};
module.exports = {
  default: { ...common, format: ['progress', 'html:relatorios/cucumber-report.html', 'json:relatorios/cucumber-report.json'] },
  dry: { ...common, dryRun: true, format: ['summary'] },
  parallel: { ...common, parallel: 2, order: 'random:42', format: ['summary'] },
  smoke: { ...common, tags: '@smoke', format: ['summary'] },
};
