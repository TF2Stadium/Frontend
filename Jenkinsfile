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
        sleep(3)
      }
    }

		stage('Test 2') {
      steps {
        sleep(3)
      }
    }

		stage('Test 2b') {
      steps {
        sleep(3)
      }
    }

		stage('Test 3') {
      steps {
        sleep(3)
      }
    }
  }

  post {
    always {
      cleanupAndNotify(currentBuild.currentResult)
    }
  }
}
