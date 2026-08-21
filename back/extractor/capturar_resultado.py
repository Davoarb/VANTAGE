import os
import json
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_session():
    local_app_data = os.getenv('LOCALAPPDATA')
    lockfile_path = os.path.join(local_app_data, r"Riot Games\Riot Client\Config\lockfile")
    with open(lockfile_path, 'r', encoding='utf-8') as f:
        data = f.read().split(':')
        return data[2], data[3]

def get_client_version(port, password):
    res = requests.get(f"https://127.0.0.1:{port}/product-session/v1/external-sessions", auth=('riot', password), verify=False)
    for _, session in res.json().items():
        if session.get("productId") == "valorant":
            return session.get("version")
    return "release-13.00-shipping-32-4990475"

def capturar_resultado():
    try:
        # 1. Leer el ID de la partida que ya guardamos
        ruta_pracc = "./back/extractor/partida_pracc_actual.json"
        if not os.path.exists(ruta_pracc):
            print("❌ No se encontró el archivo de la partida en progreso.")
            return

        with open(ruta_pracc, 'r') as f:
            datos_pracc = json.load(f)
            match_id = datos_pracc.get("MatchID")

        if not match_id:
            print("❌ El JSON no contiene un MatchID válido.")
            return

        print(f"🔍 Buscando resultados finales para: {match_id}")

        # 2. Autenticación
        port, password = get_session()
        version = get_client_version(port, password)

        res_token = requests.get(f"https://127.0.0.1:{port}/entitlements/v1/token", auth=('riot', password), verify=False)
        tokens = res_token.json()

        headers = {
            "Authorization": f"Bearer {tokens['accessToken']}",
            "X-Riot-Entitlements-JWT": tokens['token'],
            "X-Riot-ClientVersion": version,
            "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
            "Content-Type": "application/json"
        }

        # 3. Disparar al endpoint de detalles finales
        url_stats = f"https://pd.eu.a.pvp.net/match-details/v1/matches/{match_id}"
        res_stats = requests.get(url_stats, headers=headers, verify=False)

        if res_stats.status_code == 200:
            with open("./back/extractor/partida_FINAL_COMPLETA.json", "w") as f:
                json.dump(res_stats.json(), f, indent=4)
            print("✅ ¡BINGO! Estadísticas finales capturadas antes de ser borradas.")
        else:
            print(f"❌ Riot ya ha borrado la partida o no generó stats (Status: {res_stats.status_code}).")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    capturar_resultado()