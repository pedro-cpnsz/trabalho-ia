from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

genai.configure(api_key="AIzaSyDb9n7aIMKRnuQ0pOE1PrZq41h4KNJu0TY")

model = genai.GenerativeModel('gemini-1.5-pro-latest')

# Inicia uma conversa com o modelo e define o histórico inicial (vazio)
chat = model.start_chat(history=[])

# Define o endpoint para receber mensagens do cliente
@app.route('/prompt', methods=['POST'])
# Recebe o prompt do cliente e envia para o modelo
def gerar_resposta():
    data = request.json
    prompt = data.get("prompt", "")
    response = chat.send_message(prompt)
    # Retorna a resposta do modelo como JSON
    return jsonify({"response": response.text})

# Inicia o servidor Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
