"""
Test Database Connection Script
Tests user registration and database operations
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import json

BACKEND_URL = "http://localhost:8000"

print("=" * 50)
print("Testing Backend Database Connection")
print("=" * 50)

# Test 1: Health Check
print("\n1. Health Check...")
try:
    response = requests.get(f"{BACKEND_URL}/health")
    health = response.json()
    print(f"   Status: {health['status']}")
    print(f"   Database Connected: {health['database_connected']}")
    print(f"   Qdrant Connected: {health['qdrant_connected']}")
    print(f"   OpenAI Connected: {health['openai_connected']}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 2: Database Test Endpoint
print("\n2. Testing Database Endpoint...")
try:
    response = requests.get(f"{BACKEND_URL}/db/test")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 3: Register a Test User
print("\n3. Registering Test User...")
test_user = {
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User",
    "roboticsBackground": "Beginner",
    "softwareExperience": "Python, C++",
    "hardwareExperience": "Arduino, Raspberry Pi",
    "learningGoals": "Build humanoid robots",
    "educationLevel": "Undergraduate"
}

try:
    response = requests.post(
        f"{BACKEND_URL}/api/auth/sign-up/email",
        json=test_user
    )
    result = response.json()
    
    if response.status_code == 200:
        print(f"   SUCCESS: User created!")
        print(f"   User ID: {result['user']['id']}")
        print(f"   Email: {result['user']['email']}")
        print(f"   Token: {result['session']['token'][:50]}...")
    elif response.status_code == 400:
        print(f"   User already exists (this is OK)")
        print(f"   Response: {result}")
    else:
        print(f"   ERROR: {result}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 4: Sign In
print("\n4. Testing Sign In...")
try:
    response = requests.post(
        f"{BACKEND_URL}/api/auth/sign-in/email",
        json={
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    result = response.json()
    
    if response.status_code == 200:
        print(f"   SUCCESS: Signed in!")
        print(f"   Token: {result['session']['token'][:50]}...")
    else:
        print(f"   ERROR: {result}")
except Exception as e:
    print(f"   ERROR: {e}")

print("\n" + "=" * 50)
print("Testing Complete!")
print("=" * 50)
