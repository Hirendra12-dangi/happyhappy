from flask import Flask, render_template

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/home", methods=["GET"])
def home():
    return render_template("wish.html")

@app.route("/welcome", methods=["GET"])
def welcome():
    return render_template("murmu.html")


if __name__=="__main__":
    app.run(debug=True)