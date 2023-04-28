import json

def get_user_info(email):
  f = open('data.json')
  data = json.load(f)
  f.close()
  for i in data['users']:
    if email == i['email']:
      return i
  return None

def add_user(user_info):

  f = open('data.json')
  data = json.load(f)
  f.close()
  for i in data['users']:
    if user_info['email'] == i['email']:
      return None
  
  data['UID'] += 1
  user_obj = {
    'id': data['UID'],
    'email': user_info['email'],
    'name': user_info['name'],
    'password': user_info['password']
  }
  data['users'].append(user_obj)
  with open('data.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
  return user_obj
