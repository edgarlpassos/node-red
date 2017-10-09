/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var express = require("express");
var runtime;
var settings;

module.exports = {
    init: function(_runtime) {
        runtime = _runtime;
        settings = runtime.settings;
    },
    app: function() {
        var app = express();

        // Projects

        app.get("/", function(req,res) {
            // List projects
            runtime.storage.projects.listProjects().then(function(list) {
                var active = runtime.storage.projects.getActiveProject();
                var response = {
                    active: active,
                    projects: list
                };
                res.json(response);
            }).catch(function(err) {
                console.log(err.stack);
                if (err.code) {
                    res.status(400).json({error:err.code, message: err.message});
                } else {
                    res.status(400).json({error:"unexpected_error", message:err.toString()});
                }
            })
        });

        app.post("/", function(req,res) {
            // Create project
            runtime.storage.projects.createProject(req.body).then(function(name) {
                runtime.storage.projects.getProject(name).then(function(data) {
                    res.json(data);
                });
            }).catch(function(err) {
                console.log(err.stack);
                if (err.code) {
                    res.status(400).json({error:err.code, message: err.message});
                } else {
                    res.status(400).json({error:"unexpected_error", message:err.toString()});
                }
            })
        });

        app.put("/:id", function(req,res) {
            // Update a project
            //TODO: validate the payload properly
            if (req.body.active) {
                var currentProject = runtime.storage.projects.getActiveProject();
                if (req.params.id !== currentProject) {
                    runtime.storage.projects.setActiveProject(req.params.id).then(function() {
                        res.redirect(303,req.baseUrl + '/');
                    }).catch(function(err) {
                        if (err.code) {
                            res.status(400).json({error:err.code, message: err.message});
                        } else {
                            res.status(400).json({error:"unexpected_error", message:err.toString()});
                        }
                    })
                } else {
                    res.redirect(303,req.baseUrl + '/');
                }
            } else if (req.body.hasOwnProperty('credentialSecret') ||
                       req.body.hasOwnProperty('description') ||
                       req.body.hasOwnProperty('dependencies')||
                       req.body.hasOwnProperty('summary')) {
                runtime.storage.projects.updateProject(req.params.id, req.body).then(function() {
                    res.redirect(303,req.baseUrl + '/');
                }).catch(function(err) {
                    if (err.code) {
                        res.status(400).json({error:err.code, message: err.message});
                    } else {
                        res.status(400).json({error:"unexpected_error", message:err.toString()});
                    }
                })
            }

        });

        app.get("/:id", function(req,res) {
            // Get project metadata
            runtime.storage.projects.getProject(req.params.id).then(function(data) {
                if (data) {
                    res.json(data);
                } else {
                    res.status(404).end();
                }
            }).catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.delete("/:id",function(req,res) {
            // Delete project
        });

        // Project Files

        app.get("/:id/files", function(req,res) {
            runtime.storage.projects.getFiles(req.params.id).then(function(data) {
                res.json(data);
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.post(/([^\/]+)\/stage\/(.+)$/, function(req,res) {
            var projectName = req.params[0];
            var file = req.params[1];

            runtime.storage.projects.stageFile(projectName,file).then(function(data) {
                res.redirect(303,req.baseUrl+"/"+projectName+"/files");
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });
        app.post("/:id/stage", function(req,res) {
            var projectName = req.params.id;
            var files = req.body.files;

            runtime.storage.projects.stageFile(projectName,files).then(function(data) {
                res.redirect(303,req.baseUrl+"/"+projectName+"/files");
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.post("/:id/commit", function(req,res) {
            var projectName = req.params.id;

            runtime.storage.projects.commit(projectName,req.body).then(function(data) {
                res.redirect(303,req.baseUrl+"/"+projectName+"/files");
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.delete(/([^\/]+)\/stage\/(.+)$/, function(req,res) {
            var projectName = req.params[0];
            var file = req.params[1];

            runtime.storage.projects.unstageFile(projectName,file).then(function(data) {
                res.redirect(303,req.baseUrl+"/"+projectName+"/files");
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });
        app.delete("/:id/stage", function(req, res) {
            var projectName = req.params.id;
            runtime.storage.projects.unstageFile(projectName).then(function(data) {
                res.redirect(303,req.baseUrl+"/"+projectName+"/files");
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.get(/([^\/]+)\/diff\/([^\/]+)\/(.+)$/, function(req,res) {
            var projectName = req.params[0];
            var type = req.params[1];
            var file = req.params[2];
            runtime.storage.projects.getFileDiff(projectName,file,type).then(function(data) {
                res.json({
                    diff: data
                })
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.get("/:id/commits", function(req, res) {
            var projectName = req.params.id;
            var options = {};
            runtime.storage.projects.getCommits(projectName,options).then(function(data) {
                res.json(data);
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.get("/:id/commits/:sha", function(req, res) {
            var projectName = req.params.id;
            var sha = req.params.sha;

            runtime.storage.projects.getCommit(projectName,sha).then(function(data) {
                res.json({commit:data});
            })
            .catch(function(err) {
                console.log(err.stack);
                res.status(400).json({error:"unexpected_error", message:err.toString()});
            })
        });

        app.get(new RegExp("/([^\/]+)\/files\/(.*)"), function(req,res) {
            // Get project file
        });

        app.post(new RegExp("/([^\/]+)\/files\/(.*)"), function(req,res) {
            // Update project file
        });

        return app;
    }
}