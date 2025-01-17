import requests
import logging
logging.basicConfig(level=logging.INFO)
class Helper():
    def __init__(self):
        pass 

    def get_country_from_ip(self, ip):
        try:
            url = f"http://ip-api.com/json/{ip}?fields=lat,lon"
            response = requests.get(url)
            data = response.json()
            if data['status'] == 'fail':
                return None 
            return data['country']
        except Exception as e:
            logging.info(f"Unable to get location: {e}")
            return None 

    
            