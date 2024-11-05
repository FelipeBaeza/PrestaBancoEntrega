pipeline{
    agent any
    tools{
        maven "Maven"

    }
    stages{
        stage("Build JAR File"){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/hector-gallardo-araya/ayudantia-mingeso']])
                dir("TingesoBack"){
                    bat "mvn clean install"
                }
            }
        }
        stage("Test"){
            steps{
                dir("TingesoBack"){
                    bat "mvn test"
                }
            }
        }        
        stage("Build and Push Docker Image"){
            steps{
                dir("TingesoBack"){
                    script{
                         withDockerRegistry(credentialsId: 'docker-credentials'){
                            bat "docker build -t felipeb2001/back-image ."
                            bat "docker push felipeb2001/back-image"
                        }
                    }                    
                }
            }
        }
    }
}