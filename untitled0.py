# -*- coding: utf-8 -*-
"""Untitled0.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1diNan_9SF7MVOa_SzXV8tfoQdDG8myuM
"""

#primeiro ponto é baixar e instalar o modelo generativo do google
!pip install google-generativeai

#importar a ia generativa e colocar um apelido nela
import google.generativeai as genai

#aistudio.google.com
#vai no canto superior esquerdo e clique em Get API Key.
#cadastre uma nova key
#não esqueça de colocar a chave como enable
GOOGLE_GEMINI_API_KEY='AIzaSyAKUzpcAcKPqpPOd8eAzoH3vdIIgXVXSE0'
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

#o problema da key publica
#da pra esconder a chave no Secrets (chave lado esquerdo)
#importa os dados da userdata (Secrets)
from google.colab import userdata
GOOGLE_GEMINI_API_KEY=userdata.get('GOOGLE_GEMINI_API_KEY')
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

#para ver quais modelos podemos usar
for m in genai.list_models():
  #queremos apenas os modelos de LLM
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)

#cria o modelo para ser usado
model=genai.GenerativeModel('gemini-1.5-pro-latest')

#vamo testar
#porém tem um probrema, ele executa um vez e não faz mais nada, isso não é um chat
resposta= model.generate_content('Quem criou os modelos de IA Geminai?')
resposta.text

#vamos criar um chat, inclusive com base no histórico e tals
chat = model.start_chat(history=[])
prompt =input('Esperando prompt:')
while prompt!='sair':
  response =chat.send_message(prompt)
  print(response.text)
  prompt =input('Esperando prompt:')

