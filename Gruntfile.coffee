module.exports = ( grunt ) ->
  srcs = [
    'src/sonic.coffee'
    'src/iterator.coffee'
    'src/events.coffee'

    'src/tree_node.coffee'
    'src/tree.coffee'

    'src/entry.coffee'
    'src/tailing_entry.coffee'
    'src/mapped_entry.coffee'
    'src/filtered_entry.coffee'
    'src/concatenated_entry.coffee'
    'src/sorted_entry.coffee'
    'src/reversed_entry.coffee'

    'src/abstract_list.coffee'
    'src/simple_list.coffee'
    'src/tailing_list.coffee'
    'src/mapped_list.coffee'
    'src/filtered_list.coffee'
    'src/concatenated_list.coffee'
    'src/unique_list.coffee'
    'src/sorted_list.coffee'
    'src/reversed_list.coffee'

    'src/export.coffee'
  ]

  specs = [
    # '.grunt/sonic/spec_compiled/sonic.js'
    # '.grunt/sonic/spec_compiled/iterator.js'

    '.grunt/sonic/spec_compiled/abstract_list.js'
    '.grunt/sonic/spec_compiled/simple_list.js'
    '.grunt/sonic/spec_compiled/mapped_list.js'
    '.grunt/sonic/spec_compiled/filtered_list.js'
    '.grunt/sonic/spec_compiled/concatenated_list.js'
    '.grunt/sonic/spec_compiled/unique_list.js'
    '.grunt/sonic/spec_compiled/sorted_list.js'
    '.grunt/sonic/spec_compiled/tree.js'

    # '.grunt/sonic/spec_compiled/export.js'
  ]

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    coffee:
      dist:
        options:
          join: true
        files:
          'dist/sonic.js': srcs

      build:
        options:
          join: true
          sourceMap: true
        files:
          'build/sonic.js': srcs

      spec:
        files: [
          expand: true
          cwd: 'spec'
          src: ['**/*.coffee']
          dest: '.grunt/sonic/spec_compiled'
          ext: '.js'
        ]

    jasmine:
      build:
        src: ['build/**/*.js']
        options:
          specs: specs #'.grunt/sonic/spec_compiled/**/*.js'

    clean:
      build: ['build']
      spec:  ['.grunt/sonic/spec_compiled']
      grunt: ['.grunt']

    watch:
      all:
        files: ['src/**/*.coffee']
        tasks: ['dist']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'build',   ['coffee:build']
  grunt.registerTask 'dist',    ['coffee:dist']
  grunt.registerTask 'spec',    ['clean:spec', 'coffee:build', 'coffee:spec', 'jasmine:build', 'clean:spec']



# module.exports = ( grunt ) ->
#   srcs = [
#     'src/list.coffee'
#   ]

#   grunt.initConfig
#     pkg: grunt.file.readJSON('package.json')

#     meta:
#       banner:
#         '// Collection\n' +
#         '// version: <%= pkg.version %>\n' +
#         '// contributors: <%= pkg.contributors %>\n' +
#         '// license: <%= pkg.licenses[0].type %>\n'

#     coffee:
#       dist:
#         options:
#           join: true
#         files:
#           'dist/list.js': 'src/list.coffee'

#       build:
#         options:
#           join: true
#           sourceMap: true
#         files:
#           'build/list.js': 'src/list.coffee'

#       spec:
#         files: [
#           expand: true
#           cwd: 'spec'
#           src: ['**/*.coffee']
#           dest: '.grunt/list/spec_compiled'
#           ext: '.js'
#         ]

#     jasmine:
#       build:
#         src: ['build/list.js']
#         options:
#           specs: '.grunt/list/spec_compiled/**/*.js'
#           vendor: []
#           template: require('grunt-template-jasmine-istanbul')
#           templateOptions:
#             coverage: 'statistics/coverage/coverage.json'
#             report:
#               type: 'lcovonly'
#               options:
#                 dir: '.grunt/list/coverage/lcov'
#             thresholds:
#               lines: 60
#               statements: 60
#               branches: 60
#               functions: 60
#       html:
#         src: ['build/list.js']
#         options:
#           specs: '.grunt/list/spec_compiled/**/*.js'
#           vendor: []
#           template: require('grunt-template-jasmine-istanbul')
#           templateOptions:
#             coverage: 'statistics/coverage/coverage.json'
#             report:
#               type: 'html'
#               options:
#                 dir: 'statistics/coverage/html'
#             thresholds:
#               lines: 60
#               statements: 60
#               branches: 60
#               functions: 60

#     plato:
#       all:
#         options:
#           jshint: false
#         files:
#           'statistics/complexity' : ['.grunt/list/src_compiled/**/*.js']


#     clean:
#       build: ['build']
#       spec:  ['.grunt/list/spec_compiled']
#       grunt: ['.grunt']

#     watch:
#       all:
#         files: 'src/**/*.coffee'
#         tasks: ['build', 'spec']

#   grunt.registerTask 'watch',   ['coffee:build', 'watch']
#   grunt.registerTask 'spec',    ['clean:spec', 'coffee:build', 'coffee:spec', 'jasmine:build', 'clean:spec']
#   grunt.registerTask 'build',   ['coffee:build']
#   grunt.registerTask 'dist',    ['coffee:dist']
#   grunt.registerTask 'analyze', ['coffee','jasmine:html', 'plato']
