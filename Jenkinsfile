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
        milestone(2)
        sleep(3)
      }
    }

		stage('Test 2b') {
      steps {
        milestone(2)
        sleep(3)
      }
    }

		stage('Test 3') {
      steps {
        milestone(3)
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
