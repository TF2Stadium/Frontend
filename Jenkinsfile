#!/usr/bin/env groovy

pipeline {
	agent any

  options {
    timestamps()
  }

  stages {
    stage('Test') {
      steps {
        milestone(1)
        sleep(1000)
      }
    }

		stage('Test 2') {
      steps {
        milestone(2)
        sleep(1000)
      }
    }

		stage('Test 2b') {
      steps {
        milestone(2)
        sleep(1000)
      }
    }

		stage('Test 3') {
      steps {
        milestone(3)
        sleep(1000)
      }
    }
  }

  post {
    always {
      cleanupAndNotify(currentBuild.currentResult)
    }
  }
}
