import os
from app import app

def generate_homepage():
    print("Generating static index.html from Flask template...")
    with app.test_client() as client:
        response = client.get("/")
        if response.status_code == 200:
            html = response.get_data(as_text=True)
            output_path = "index.html"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"Successfully generated: {output_path}")
        else:
            print(f"Error: failed to fetch homepage, status code: {response.status_code}")

if __name__ == "__main__":
    generate_homepage()
