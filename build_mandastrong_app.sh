#!/bin/bash

# Base directory
BASE_DIR="/home/MandaStrong1/mandastrong_studio"

# Create necessary directories
mkdir -p "$BASE_DIR/static"
mkdir -p "$BASE_DIR/templates"

# Create app.py
cat > "$BASE_DIR/app.py" <<'EOF'
from flask import Flask, render_template, url_for
app = Flask(__name__)

@app.route("/")
def page1():
    return render_template("page1.html")

@app.route("/page<int:page_number>")
def page(page_number):
    if 1 <= page_number <= 21 and page_number != 10:
        return render_template(f"page{page_number}.html")
    elif page_number == 10:
        return render_template("page10_placeholder.html")
    return "Page not found", 404

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/builder")
def builder():
    return render_template("builder.html")

if __name__ == "__main__":
    app.run(debug=True)
EOF

# Create page10 placeholder
cat > "$BASE_DIR/templates/page10_placeholder.html" <<'EOF'
<!DOCTYPE html>
<html>
<head><title>Page 10</title></head>
<body style="background:black; color:white; text-align:center;">
    <h1>Page 10 – Placeholder</h1>
</body>
</html>
EOF

# Generate pages 1 to 21 with specific video placements
for i in $(seq 1 21); do
    if [ "$i" -eq 10 ]; then
        continue
    fi

    VIDEO_BG=""
    VIDEO_CORNER=""

    if [ "$i" -eq 1 ] || [ "$i" -eq 2 ]; then
        VIDEO_BG='<video autoplay muted loop id="bgvid" style="position:fixed; right:0; bottom:0; min-width:100%; min-height:100%; z-index:-1;"><source src="{{ url_for('static', filename='background.mp4') }}" type="video/mp4"></video>'
    fi

    if [ "$i" -eq 1 ]; then
        VIDEO_CORNER='<video controls style="position:absolute; bottom:20px; right:20px; width:200px;"><source src="{{ url_for('static', filename='avatar.mp4') }}" type="video/mp4"></video>'
    fi

    NEXT_LINK=""
    PREV_LINK=""

    if [ "$i" -gt 1 ]; then
        PREV_LINK="<a href='/page$((i - 1))'>← Back</a>"
    fi
    if [ "$i" -lt 21 ]; then
        NEXT_LINK="<a href='/page$((i + 1))'>Next →</a>"
    fi

    cat > "$BASE_DIR/templates/page$i.html" <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Page $i</title>
    <style>
        body {
            margin: 0;
            font-family: 'Arial', sans-serif;
            background: black;
            color: white;
            text-align: center;
        }
        h1 {
            margin-top: 100px;
        }
        nav a {
            color: cyan;
            font-weight: bold;
            margin: 20px;
            text-decoration: none;
            font-size: 1.5rem;
        }
    </style>
</head>
<body>
    $VIDEO_BG
    $VIDEO_CORNER
    <h1>Welcome to Page $i</h1>
    <nav>
        $PREV_LINK
        $NEXT_LINK
    </nav>
</body>
</html>
EOF
done

# Create thank-you page 21 with November video
cat > "$BASE_DIR/templates/page21.html" <<'EOF'
<!DOCTYPE html>
<html>
<head><title>Thank You</title></head>
<body style="background:black; color:white; text-align:center;">
    <h1>Thank you for using MandaStrong Studio!</h1>
    <video controls autoplay muted width="100%">
        <source src="{{ url_for('static', filename='November.mp4') }}" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</body>
</html>
EOF

# Create login, register, dashboard, builder templates
for page in login register dashboard builder; do
    cat > "$BASE_DIR/templates/$page.html" <<EOF
<!DOCTYPE html>
<html>
<head><title>${page^}</title></head>
<body style="background:black; color:white; text-align:center;">
    <h1>${page^} Page</h1>
</body>
</html>
EOF
done

echo "✅ App structure created in $BASE_DIR"
echo "⚠️ Ensure avatar.mp4, background.mp4, and November.mp4 are in the static folder."
