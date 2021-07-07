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
			parallel {
				stage('Test 2a') {
					steps {
						sleep(3)
					}
				}

				stage('Test 2b') {
					steps {
						sleep(3)
					}
				}

				stage('Test 2c') {
					steps {
						sleep(5)
					}
				}
				stage('Test 2d') {
					steps {
						sleep(5)
					}
				}
				stage('Test 2e') {
					steps {
						sleep(5)
					}
				}
			}
    }

		stage('Test 3') {
      steps {
        sleep(3)
      }
    }

		stage('Test 4') {
      steps {
        sleep(3)
      }
    }
  }
}
