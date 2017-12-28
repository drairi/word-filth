// vi: set sw=2 et :

(function () {

  var shuffle = function(array) {
    var i = 0
      , j = 0
      , temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var wordList = [];

  var addWordList = function(listName, pairs) {
    wordList = wordList.concat(pairs);
  };

  var importSimplePairs = function (blockOfText) {
    var pairs = [];

    blockOfText.split(/\n/).forEach(function (lineOfText) {
      var m;
      if (m = lineOfText.match(/^\s*([a-zéæøå]+)\s+(\w+)(\s\(.*\))?\s*$/)) {
        pairs.push({ en_gb: m[2], da_dk: m[1] });
      } else if (lineOfText.match(/\S/)) {
        console.log("Not importing: " + lineOfText);
      }
    });

    return pairs;
  };

  addWordList('days', importSimplePairs(`
    mandag	Monday
    tirsdag	Tuesday
    onsdag	Wednesday
    torsdag	Thursday
    fredag	Friday
    lørdag	Saturday
    søndag	Sunday
  `));

  addWordList('months', importSimplePairs(`
    januar	January
    februar	February
    marts	March
    april	April
    maj	May
    juni	June
    juli	July
    august	August
    september	September
    oktober	October
    november	November
    december	December
  `));

  addWordList('seasons', importSimplePairs(`
    forår	Spring
    sommer	Summer
    efterår	Autumn
    vinter	Winter
  `));

  addWordList('nouns', importSimplePairs(`
adress	address
advokat	lawyer
æble	apple
æg	egg
ægteskab	marriage
afdeling	department
aftensmad	dinner
and	duck
appelsin	orange
arbejde	worker
arkitekt	architect
armbåndsur	watch
avis	newspaper
bad	bath
badeværelse	bathroom
bamse	teddy bear
bank	bank (money??)
bar	bar (pub)
barn	child
batteri	battery
bedstefar	grandfather
bedstemor	grandmother
betjent	cop???
biograf	cinema
bjørn	bear
blad	magazine
bøf	beef
bog	book
bondegårde	farm
bord	table
borgmester	mayor
børn	children
boulevard	boulevard
brød	bread
bror	brother
bukserne	the trousers
by	city, town
bygning	building
centrum	centre
chef	boss
citron	lemon
computer	computer
dal	valley, dale
datter	daughter
den studerende	the student
derhenne	over there
direktør	manager
distrikt	district
doktor	doctor
dommer	judge
døtre	daughters
dotrene	the daughters
drengen	the boy
dyr	animal
edderkop	spider
ejendom	property (building??)
elefant	elephant
enhjørning	unicorn
erhverv	profession
fængsel	jail
familien	the family
far	father
fest	party
fisk	fish
fjernsyn	television
flask	bottle
fødsel	birth
forældre	parents
forfatter	author
frakken	the coat
frokost	lunch
frugter	fruit
fugle	bird
gad	street
gæst	guest
gård	garden (US: yard)
generation	generation
græns	border
hatten	the hat
hav	garden
havn	harbour, port
hesten	the horse
hjem	home
hjørn	corner
højre	right (direction)
hotel	hotel
hovedstad	capital (city)
hund	dog
hus	house
ingeniør	engineer
is	ice cream
jakke	jacket
jakkesættet	the suit
jobbet	the job
jord	ground, earth, Earth
kage	cake
kaptaijn	captain
karriere	career
kartoffel	potato
kat	cat
kirke	church
kjolen	the dress
kød	meat
kokken	cook
kokken	kitchen
kone	wife
kontor	office
krabbe	crab
kunstner	artist
kurv	basket
kvinden	the woman
kylling	chicken
kyster	coast
lampe	lamp
land	country
landmand	farmer
landsby	village
leg	game
legetøj	toy
løve	lion
lufthavne	airport
mad	food
mælk	milk
måltid	meal
mand	husband
manden	the man
marked	fair
menuen	the menu
mobiltelefon	cellphone, mobile
model	model
mor	mother
morgenmad	breakfast
mus	mouse
museum	museum
nabolag	neighbourhood
navn	name
nederdel	skirt
ninja	ninja
norden	The North
ø	island!
olien	the oil
område	area
onkel	uncle
ost	cheese
palads	palace
park	park
pasta	pasta
personale	staff
pigen	the girl
plads	place, square
politi	police
professionel	professional (adj)
radio	radio
regnbue	rainbow
restaurant	restaurant
ris	rice
rut	route
sæb	soap
saft	juice
salt	salt
samfund	community
sandwich	sandwich
sang	song
scene	stage (performance)
sekretær	secretary
seng	bed
servitrice	waitress
skål	bowl
ske	spoon
skildpadde	tortoise
skjort	the shirt
sko	the shoe
skrivebord	desk
skuespiller	actor
slange	snake
slot	castle
smule	a bit
sofa	sofa
soldater	soldier
søn	son
søskende	siblings
spelj	mirror
station	station
sted	place
stol	chair
strand	beach
strømper	socks
studerende	student
stue	living room
sukker	sugar
suppe	soup
svinekød	pork
tallerken	the plate
tante	aunt
tårn	tower
tjener	waiter
tøjet	clothes
tomat	tomato
torv	square
tur	tour
ugle	owl
ur	clock
værelse	room
vagt	guard
vampyr	vampire
vand	water
venstre	left (not right)
vesten	The West
vin	wine
vindue	window
visen	show
zone	zone
zoologisk have	zoo
dør	door
skrab	razor
skærm	screen
kasse	box
pung	wallet
TV	TV
sengetøj	sheet (bed clothes)
gulv	floor
telefon	telephone
væg	wall
task	bag
paraply	umbrella
hjul	wheel
tandpasta	toothpaste
tandbørst	toothbrush
nøgl	key
svamp	sponge
svømmebassin	swimming pool
brev	letter (correspondence)
skab	cupboard
tag	roof
ting	thing
glass	glass
papir	paper
klokke	bell
pand	pan
maskin	machine
	scissors
kop	cup
styk	piece
motor	motor, engine
ark	sheet (bed)
pak	package
snor	string
genstand	object
flag	flag
roman	novel ("romance")
kæde	chain
pulver	powder
kam	comb
rod	root
kniv	knife
gave	present, gift
smykke	piece of jewelry
gaffel	fork
haj	shark
kæledyr	pet
tiger	tiger
hval	whale
giraf	giraffe
ab	monkey
delfin	dolphin
ulv	wolf
husdyr	livestock / domestic animals
ko	cow
pingvin	penguin
ræv	fox
vandman	jellyfish
hjorte	deer
gris	pig
myre	ant
insekt	insect
svane	swan
kanin	rabbit
høne	hen
orm	worm
egern	squirrel
isbjørn	polar bear
grævling	badger
pindsvin	hedgehog
slanger	snake
får	sheep
solsort	blackbird
måger	seagulls
alder	age
baby	baby
person	person
kæreste	boyfriend/girlfriend
offentlighed	public
fjende	enemy ("fiend")
ven	friend
komite	committee
ungdomme	youth
befolkning	population
konference	conference
fundament	foundation
ungdom	youth
folk	people ("a people")
borger	citizen
par	couple (people)
individ	individual (person)
offer	victim
forhold	relationship
anden	another
cykl	bicycle
bil	car
tog	train
kuffert	suitcase
bus	bus
motorcykel	motorcycle
fly	aeroplane
båd	boat
besøg	visit
guide	guide
køretøj	vehicle
kort	map, card
skib	ship
transport	transport, transportation
vej	way, road
eventyr	adventure
bro	bridge
flyvemaskine	aeroplane ("fly machine")
flyvetur	flight
tur	tour, trip, turn
afrejse	departure
rejse	journey
undergrundsban	Underground (metro, subway)
rum	room
pas	passport
europæer	European
én	one
hinanden	each other
samtale	conversation
rygsæk	rucksack, backpack
system	system
kærlighed	love
del	part
andmendelse	review
liste	list
udsigt	view
gruppe	group
type	type
pung	wallet
design	design
måde	way, method?
ordre	order
vej	way, road
tilfældet	the case (situation, fact)
version	version
indhold	content
handling	act, action, plot
billede	picture
pung	wallet
kategorie	category
udstyr	equipment
værdi	value
beskrivelse	description
mulighed	option, possibility
problem	problem
resultat	result
forestilling	performance
system	system
profil	profile
kontrol	control
opkald	call
medlem	member
niveau	level
konto	account (bank)
ændringer	changes
produktion	production
løsning	solution
aftale	agreement
tur	turn
konstruktion	construction
beskyttelse	protection
forening	club, union
håb	hope
indgang	entrance, entry
sind	mind
ønske	wish
chance	chance
grad	degree (temperature)
formål	purpose
bevis	proof, evidence
stemme	voice
emne	topic, matter, subject
valg	choice
rolle	role
introduktion	introduction
succes	success
hvile	rest
kræft	power
fag	subject
prise	prize
karakter	character, grade
alternativ	alternative
kant	edge
mørk	dark
slags	kind of
hukommelse	memory
optangelse	record (data)
gamle	age, old
færdig	ready
stor	big
klog	smart, clever, wise
mere end	more than
ny	new
hvor gammel	how old
større	bigger
mindre	smaller
ældre	older
sur	angry, sour
ret	pretty
yngre	younger
flest	most, the most
ungt	young
trist	sad
fuld	drunk
lang	long
størst	biggest
mest	most
bedst	best
smukkere	prettier
gratis	free (beer)
fri	free (liberty)
mæt	full (food)
ren	clean
renere	cleaner
kort	short
dårlig	bad
billig	cheap
billigere	cheaper
forfærdelig	terrible
varm	hot (warm)
bedre	better
i stand til	able
hård	hard (physical)
tilgængelig	available
dejlig	lovely
klar	clear, ready
simpel	simple
stærk	strong
sammen	together
flot	pretty
sulten	hungry
glad	happy
hurtig	fast, quick
sand	true
rig	rich (money)
fattig	poor (money)
retfærdig	fair
kold	cold
dyb	deep
skarp	sharp
tørstig	thirsty
sød	sweet (person)
høj	tall
værre	worse
sikker	sure
svag	weak
kedelig	boring
alene	alone
forskellig	different
  `));

  addWordList('adjectives', importSimplePairs(`
åben	open
allerede	already
anderledes	different
ansvarlig	responsible
bange	scared, afraid
bekvem	convenient
berømt	famous
beskidt	dirty
beskidt(e)	dirty
dyr	expensive
egen, egne (pl)	own
endelig	final
fantastiske	fantastic, amazing
forkert	wrong
framragende	excellent
fremtidige	future
generelle	general
håber	hope
hel	whole, entire
historiske	historical
hyppige	frequent
i live	alive
imidlertid	however
interessant	interesting
kede af det	sorry
kulturelt	cultural
levende	living
lille	little, small
lokalt 	local
lovlig	legal
menneskelig	human
militær	military
moderne	modern
modsatte	opposite
mulige	possible
næste	next
negativ	negative
nødvendig(e)	necessary
normal(e)	normal
normalt	normally
nylige	recent
officielt	official
ond(e)	evil [ones]
opdrager	raise
perfekte	perfect
personligt	personal
populære	popular
positiv	positive
praktisk	practical, convenient
privat	private
rækker ... til	hands ... to
religiøs	religious
ren	clean
rigtig	correct, real
sædvanligvis	usually
samme	same
seriøst	serious
sjov	fun, funny
små	small
smuk	beautiful
søg	search, seek, look for
speciel	special
stor	great, big
svær	difficult
svigter	fail
tilgængelig 	available
tosproget	bilingual
traditionel	traditional
træt(te)	tired
trist	sad
tror	think, believe
uafhængig	independent
umulig	impossible
underligt	strange
velkendt	familiar
venstre	left (as in, right)
vigtig	important
fuldstændig	completely
nemt	easily
især	especially
tidlig	soon
effektiv	efficient
bestemt	definitely
stor	big
hverken	neither
lige	straight
både	both
andre	other
hinanden	each other
få	few, get
sådan	such, like that
stille	quiet
så vidt	as far as
faktisk	in fact
lækker	delicious
forsigtig	carefully
uanset	whatever, no matter
uanset hvad	no matter what
ligesom	like
tilstrækkelig	enough, sufficient
bestemt	definitely
portugisisk	Portuguese
spansk	Spanish
brasiliansk	Brazilian
flyden	fluent
udenlands	abroad
tilsyneladende	apparently
plejer	usually
grundet	due to
sent	late
afgørende	essential
velkend	familiar
tidligere	previously
forrige	previous
tidlig	early
siden	since (time)
  `));

  const SHUFFLE_EVERY = 5;
  const SHUFFLE_EXCEPT_LAST_N = 5;
  var iterations = 0;
  var nextWordPair = function() {
    var p = wordList.pop();
    wordList.unshift(p);

    if (++iterations >= SHUFFLE_EVERY) {
      var p1 = wordList.splice(0, wordList.length - SHUFFLE_EXCEPT_LAST_N);
      shuffle(p1);
      wordList = p1.concat(wordList);
      iterations = 0;
    }

    return(p);
  };

  var tidyText = function(t) {
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var matchingText = function(textA, textB) {
    return(tidyText(textA) === tidyText(textB));
  };

  var doSimpleTextToText = function(promptText, challengeWord, correctResponseWord) {
    $('.heading').text(promptText);
    $('.challenge').text(challengeWord);
    $('.response').val('');
    $('.response').focus();

    $('.message-correct').hide();
    $('.message-incorrect').hide();
    $('.message-give-up').hide();

    $('form').off('submit');
    $('form').off('reset');

    $('form').on('submit', function (event) {

      var givenAnswer = $('.response').val();

      if (matchingText(correctResponseWord, givenAnswer)) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          nextQuestion();
        });
      } else {
        $('.message-incorrect').show().delay(750).fadeOut(250);
      }

      return false;
    });

    $('form').on('reset', function (event) {
      $('.message-give-up .correct-answer').text(correctResponseWord);
      $('.message-give-up').show().delay(2000).fadeOut(250, function () {
        nextQuestion();
      });

      return false;
    });
  };

  var doSimpleDkToEn = function() {
    var pair = nextWordPair();
    doSimpleTextToText('Hvad er den engelsk ord for:', pair.da_dk, pair.en_gb);
  };

  var doSimpleEnToDk = function() {
    var pair = nextWordPair();
    doSimpleTextToText('Hvad er den dansk ord for:', pair.en_gb, pair.da_dk);
  };

  var nextQuestion = function() {
    if (Math.random() > 0.5) {
      doSimpleDkToEn();
    } else {
      doSimpleEnToDk();
    }
  };

  var newGame = function () {
    shuffle(wordList);
    nextQuestion();
  };

  $(document).ready(newGame);

})();
