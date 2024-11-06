pipeline{
    agent any
    tools{
        maven "Maven"

    }
    stages{
        stage("Build JAR File"){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/FelipeBaeza/PrestaBancoEntrega']])
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
                        bat "docker context use default"
                         withDockerRegistry(credentialsId: 'docker-credentials'){
                            bat "docker build -t felipeb2001/backend-image ."
                            bat "docker push felipeb2001/backend-image"
                        }
                    }                    
                }
            }
        }
    }
}