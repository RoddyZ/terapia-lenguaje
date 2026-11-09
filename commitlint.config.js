export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // `content`: cambios de contenido terapéutico (palabras, letras, visemas).
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'content',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
