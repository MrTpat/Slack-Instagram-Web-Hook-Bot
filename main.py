import requests
from bs4 import BeautifulSoup
import json
import time
from pymongo import MongoClient
tagz = 'mentorme'
starttime=time.time()
LISTOFPOSTEDINSTAGRAMPOSTS = []
client = MongoClient('mongodb+srv://tilak:Basketball23@cluster0-vyhsz.mongodb.net/test?retryWrites=true')
db = client["test"]
infos = db["infos"]
while True:
  
  tagz = infos.find_one()['instaTAG']
  tokenz = infos.find_one()['oauthToken']
  channelz = infos.find_one()['channel']
  r  = requests.get("https://www.instagram.com/explore/tags/" + tagz + "/?hl=en")
  data = r.text
  soup = BeautifulSoup(data, 'html.parser')
  tag = soup.findAll('script')
   #keeps track of the posts that I have already added to the slack
  time.sleep(5.0 - ((time.time() - starttime) % 5.0))
  jsonnotfinal = tag[3].text[21:]
  json1 = json.loads(jsonnotfinal[:len(jsonnotfinal) - 1])  #contains all the text inside of the script tag
  ALLPOSTS = json1['entry_data']['TagPage'][0]['graphql']['hashtag']['edge_hashtag_to_media']['edges']
  for x in ALLPOSTS[:5]: 
    currentPost = x['node']['shortcode']
    if currentPost not in LISTOFPOSTEDINSTAGRAMPOSTS:
        LISTOFPOSTEDINSTAGRAMPOSTS.append(currentPost)
        text = x['node']['edge_media_to_caption']['edges'][0]['node']['text']
        print('Added' + currentPost)
        req = requests.post('https://slack.com/api/chat.postMessage?token=' + tokenz + '&channel=' + channelz + '&text=' + 'https://www.instagram.com/p/' + currentPost + '                   ' + text)




