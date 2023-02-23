GNU nano 5.4                                                                                                            webserver.py
# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import ssl
import urllib.parse

# @author juliusritter
# Learn more here: https://huggingface.co/course/chapter2/6?fw=pt

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from torch import nn

# From https://huggingface.co/Hello-SimpleAI/chatgpt-detector-roberta
tokenizer = AutoTokenizer.from_pretrained("Hello-SimpleAI/chatgpt-detector-roberta")
model = AutoModelForSequenceClassification.from_pretrained("Hello-SimpleAI/chatgpt-detector-roberta")

hostName = "honesty-ai.com"
serverPort = 443

class MyServer(BaseHTTPRequestHandler):
  def do_GET(self):
      self.send_response(200)
      self.send_header("Access-Control-Allow-Origin", "*")
      self.send_header("Content-type", "text/html")
      self.end_headers()
      if (self.path[:7] != "/check?"):
          self.wfile.write(bytes("<html><head><title>Nothing</title></head>", "utf-8"))
          self.wfile.write(bytes("<p>Request: %s</p>" % self.path, "utf-8"))
          self.wfile.write(bytes("<body>", "utf-8"))
          self.wfile.write(bytes("<p>Nothing to see here.</p>", "utf-8"))
          self.wfile.write(bytes("</body></html>", "utf-8"))
      else:
          # In our case is max_length = 512 (BERT Limit), Return as PyTorch Tensors
          # input = "Helleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee I'm ChatGPT and I love you. How are you?"
          # model_input = tokenizer(input, padding="max_length", return_tensors="pt")
          model_input = tokenizer(urllib.parse.unquote(self.path[7:]), padding="max_length", return_tensors="pt")
          # print(model_input["input_ids"])

          # Logits, not Predictions (yet)
          model_output = model(**model_input)
          # print(model_output)

          # Final prediction
          predictions = nn.functional.softmax(model_output.logits, dim=-1)

          self.wfile.write(bytes(str(predictions[0][1].item())[:6], "utf-8"))

if __name__ == "__main__":
  webServer = HTTPServer((hostName, serverPort), MyServer)
  print("Server started https://%s:%s" % (hostName, serverPort))

  webServer.socket = ssl.wrap_socket (webServer.socket,
      keyfile="/etc/letsencrypt/live/ignis-apps.com/privkey.pem",
      certfile='/etc/letsencrypt/live/ignis-apps.com/fullchain.pem', server_side=True)
  try:
      webServer.serve_forever()
  except KeyboardInterrupt:
      pass

  webServer.server_close()
  print("Server stopped.")
