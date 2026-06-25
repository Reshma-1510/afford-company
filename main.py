import requests
from datetime import datetime
import heapq

def get_top_notifications(api_url, token, n):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(api_url, headers=headers)
    
    if response.status_code != 200:
        return []

    data = response.json()
    weights = {'placement': 3, 'result': 2, 'event': 1}

    def priority_key(item):
        w = weights.get(item.get('type', '').lower(), 0)
        t_str = item.get('timestamp', '')
        try:
            t = datetime.fromisoformat(t_str.replace('Z', '+00:00'))
        except ValueError:
            t = datetime.min
        return (w, t)

    unread = [item for item in data if item.get('status', '').lower() == 'unread']
    return heapq.nlargest(n, unread, key=priority_key)

if __name__ == "__main__":
    url = "http://4.224.186.213/evaluation-service/notifications"
    access_token = "ahXjvp"
    n_value = 10
    
    top_notifications = get_top_notifications(url, access_token, n_value)
    for notif in top_notifications:
        print(notif)