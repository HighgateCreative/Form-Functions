module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("bower.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +
                " *\n" +
                " *  Made by \n<% _.forEach(pkg.authors, function(author) { %> *  <%= author %>\n<%  }); %>" +
                " *  Under <%= pkg.license %> License\n" +
                " */\n"
        },

        // Concat definitions
        concat: {
            dist: {
                src: ["src/form_functions.js"],
                dest: "dist/form_functions.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },

        // Lint definitions
        jshint: {
            files: ["src/form_functions.js"],
            options: {
                jshintrc: ".jshintrc",
                // Source:
                // https://github.com/jshint/jshint/issues/2922#issuecomment-219263558
                reporterOutput: ""
            }
        },

        // Minify definitions
        uglify: {
            my_target: {
                src: ["dist/form_functions.js"],
                dest: "dist/form_functions.min.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },

        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            jshint: {
                files: ['src/*'],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["jshint", "concat", "uglify"]);
    grunt.registerTask("travis", ["jshint"]);
};
