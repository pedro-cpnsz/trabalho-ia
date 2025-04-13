from flask import Flask, request, jsonify
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPIError

app = Flask(__name__)

genai.configure(api_key="AIzaSyDb9n7aIMKRnuQ0pOE1PrZq41h4KNJu0TY")

# Define o modelo (versão) a ser utilizado
model = genai.GenerativeModel('gemini-2.0-flash')

# Inicia uma conversa com o modelo e define o histórico inicial (vazio)
chat = model.start_chat(history=[])

# Define o endpoint para receber mensagens do cliente
@app.route('/prompt', methods=['POST'])
# Recebe o prompt do cliente e envia para o modelo
def gerar_resposta():
    try:
        data = request.json
        prompt = data.get("prompt", "")
        # Verifica se o prompt não está vazio
        if not prompt:
            return jsonify({"error": "Prompt vazio."}), 400
        response = chat.send_message(prompt)
        # Retorna a resposta do modelo como JSON
        return jsonify({"response": response.text})
    # Captura erros específicos da API do Gemini
    except GoogleAPIError as e:
        return jsonify({"error": f"Erro com a API do Gemini: {str(e)}"}), 500
    
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

# Inicia o servidor Flask
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
