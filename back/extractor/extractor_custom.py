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
    # Necesitamos consultar la sesión externa para sacar la versión correcta del cliente
    res = requests.get(f"https://127.0.0.1:{port}/product-session/v1/external-sessions", auth=('riot', password), verify=False)
    sessions = res.json()
    for _, session in sessions.items():
        if session.get("productId") == "valorant":
            return session.get("version")
    return "release-13.00-shipping-32-4990475"

def fetch_custom_game():
    try:
        port, password = get_session()
        version = get_client_version(port, password)

        # 1. Obtener Tokens
        res = requests.get(f"https://127.0.0.1:{port}/entitlements/v1/token", auth=('riot', password), verify=False)
        data_res = res.json()
        token = data_res['accessToken']
        entitlement = data_res['token']

        headers = {
            "Authorization": f"Bearer {token}",
            "X-Riot-Entitlements-JWT": entitlement,
            "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
            "X-Riot-ClientVersion": version,
            "Content-Type": "application/json"
        }

        # 2. Obtener PUUID
        user_info = requests.get(f"https://127.0.0.1:{port}/rso-auth/v1/authorization/userinfo", auth=('riot', password), verify=False).json()
        puuid = json.loads(user_info['userInfo'])['sub']

        # 3. Consultar partida
        res_match = requests.get(f"https://glz-eu-1.eu.a.pvp.net/core-game/v1/players/{puuid}", headers=headers, verify=False)
        data = res_match.json()

        match_id = data.get('MatchID')

        # Respaldo por si estás en pregame
        if not match_id:
            res_pre = requests.get(f"https://glz-eu-1.eu.a.pvp.net/pregame/v1/players/{puuid}", headers=headers, verify=False)
            match_id = res_pre.json().get('MatchID')

        if not match_id:
            print("❌ No se ha encontrado una partida activa (ni core-game ni pregame).")
            return

        print(f"🎯 Partida detectada: {match_id}")

        destino = "./back/extractor/"
        if not os.path.exists(destino): os.makedirs(destino)

        # 4. AQUÍ ESTÁ LO QUE TE HABÍA QUITADO: Descargar el JSON en VIVO
        try:
            match_data_live = requests.get(f"https://glz-eu-1.eu.a.pvp.net/core-game/v1/matches/{match_id}", headers=headers, verify=False).json()
            with open(os.path.join(destino, "partida_pracc_actual.json"), "w") as f:
                json.dump(match_data_live, f, indent=4)
            print("✅ Partida Custom guardada (JSON completo con progreso).")
        except Exception as e:
            print(f"⚠️ Error guardando el JSON en vivo: {e}")

        # 5. Intentar descargar las stats finales como bonus (si ya terminó)
        url_stats = f"https://pd.eu.a.pvp.net/match-details/v1/matches/{match_id}"
        res_stats = requests.get(url_stats, headers=headers, verify=False)

        if res_stats.status_code == 200:
            with open(os.path.join(destino, "partida_FINAL_COMPLETA.json"), "w") as f:
                json.dump(res_stats.json(), f, indent=4)
            print("✅ ¡ESTADÍSTICAS FINALES DESCARGADAS TAMBIÉN!")
        else:
            print(f"⏳ Estadísticas post-partida no disponibles aún (Status: {res_stats.status_code}). ¡Pero ya tienes tu JSON 'partida_pracc_actual' a salvo!")

    except Exception as e:
        print(f"❌ Error crítico: {e}")

if __name__ == "__main__":
    fetch_custom_game()