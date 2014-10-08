__author__ = 'Evan B.'

from lxml import html
import requests

page = requests.get('http://www.sportingnews.com/nba/statistics/player/all/sort/points_per_game/2013')
tree = html.fromstring(page.text)

playerData = tree.xpath('//td[@class="player"]/text()')

print playerData