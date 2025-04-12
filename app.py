from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

genai.configure(api_key="AIzaSyAKUzpcAcKPqpPOd8eAzoH3vdIIgXVXSE0")

model = genai.GenerativeModel('gemini-1.5-pro-latest')
chat = model.start_chat(history=[])

@app.route('/prompt', methods=['POST'])
def gerar_resposta():
    data = request.json
    prompt = data.get("prompt", "")
    response = chat.send_message(prompt)
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
