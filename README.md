# Ascend Assignment (DevOps)

## Getting Started

### Install Docker 

https://docs.docker.com/install

### Clone ascend-assignment-dev-ops to your local machine

    $ git clone https://github.com/nattasak13472/ascend-assignment-dev-ops.git ascend-assignment-dev-ops

### Create a containerized nodejs app

Run script to create docker image for nodejs app      
    
    $ cd ascend-assignment-dev-ops/nodejs
    $ ./script.sh

### Install Jenkins & Configuration

Run script to create docker image for jenkins

    $ cd ascend-assignment-dev-ops/pipeline
    $ ./script.sh

Run Jenkins docker container

    $ docker run -p 8888:8080 -p 50000:50000 -v /var/run/docker.sock:/var/run/docker.sock -d ascend-assignment-jenkins

_( more detail : https://jenkins.io/doc/book/installing/ )_

#### Set up jenkins's suggested plugins and [NodeJs plugin](https://wiki.jenkins.io/display/JENKINS/NodeJS+Plugin)
    url: <your-jenkins-host>:8888/pluginManager/

#### Set up global credentials (username, password) for DockerHub using name 'docker-hub'
    url: <your-jenkins-host>:8888/credentials/store/system/domain/_/

### Create new Jenkins's job

#### 1. Go to create new jenkins's job page
    url: <your-jenkins-host>:8888/view/all/newJob

#### 2. Enter job's name and choose Pipeline 

#### 3. On Pipeline section

Select Definition > Pipeline script

Enter script : 

        pipeline {
    
            environment {
                gitRepository = "https://github.com/nattasak13472/ascend-assignment-dev-ops.git"
                registry = "<your-docker-registry>"
                registryCredential = 'docker-hub'
            }
            
            agent any
            
            tools { nodejs "node" }
            
            stages {
            
                stage('Cloning Git') {
                    steps {
                        git gitRepository
                    }
                }
                
                stage('Build') {
                    steps {
                        sh 'cd nodejs && npm install'
                    }
                }
                
                stage('Test') {
                    steps {
                        sh 'cd nodejs && npm test'
                    }
                }
                
                stage('Building Image') {
                    steps{
                        sh "cd nodejs && docker tag ascend-assignment-nodejs " + registry + ":$BUILD_NUMBER && docker build -t " + registry + ":$BUILD_NUMBER ."
                    }
                }
                
                stage('Deploy Image') {
                    steps {
                        script {
                            docker.withRegistry('', registryCredential ) {
                                sh "docker push " + registry
                            }
                        }
                    }
                }
            
            }
        }

### Install Minikube 

https://kubernetes.io/docs/tasks/tools/install-minikube/

### Start Minikube 

    minikube start

### Create Deployment

using this command to create new deployment:

    kubectl run ascend-assignment-nodejs --image=<your-docker-registry>:<tag> --port=8080 --image-pull-policy=Always

checking created deployment

    kubectl get deployment

checking created pod

    kubectl get pod

### Create Service

using this command to create new service:

    kubectl expose deployment ascend-assignment-nodejs --type=LoadBalancer 

checking created service
    
    kubectl get services

run service via minikube

    minikube service ascend-assignment-nodejs
