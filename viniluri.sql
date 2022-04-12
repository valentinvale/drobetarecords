DROP TYPE IF EXISTS categ_discuri;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_discuri AS ENUM('viniluri', 'cd-uri');
CREATE TYPE tipuri_produse AS ENUM( 'punk', 'pop-punk', 'math-rock', 'midwest-emo', 'alternative', 'indie');



CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   marime INT NOT NULL CHECK (marime>=0),   
   tip_produs tipuri_produse,
   categorie categ_discuri,
   artist VARCHAR(50) NOT NULL
   genuri VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into discuri (nume, descriere, pret, marime, tip_produs, categorie, artist, genuri, imagine) VALUES 
('Pilot', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Hot Mulligan', '{"Pop-Punk","Midwest-Emo","Math-Rock"}', 'hotmulligan_pilot_300x300.jpg'),

('You ll Be Fine', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Hot Mulligan', '{"Pop-Punk","Midwest-Emo","Math-Rock"}', 'hotmulligan_ybf_300x300.jpg'),

('Opportunities', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Hot Mulligan', '{"Pop-Punk","Midwest-Emo","Math-Rock"}', 'hotmulligan_opportunities_300x300.jpg'),

('Dulcelind cu fructe', 'Rețetă proprie, cu conținut sănătos (dacă ignorați tonele de zahăr) de fruncte proaspete', 10 , 250, 620, 'cofetarie', 'aniversara', '{"frisca","zahar","faina","zmeura","lapte","mure","capsuni"}', False,'dulcelind.jpg'),

('Tartă cu căpșuni', 'Sub căpșuni se află o tartă.', 6 , 245, 280, 'cofetarie', 'comuna', '{"vanilie","faina","capsuni","lapte", "indulcitor"}', True,'tarta-capsuni.jpg'),

('Nimic', 'Nimic', 10 , 0, 0, 'cofetarie', 'dietetica', '{}', False, 'nimic.jpg'),

('Cozonac zburător', 'Cineva a vărsat heliu peste aluat.', 25.5 , 1000, 1800, 'patiserie', 'comuna', '{"zahar","unt","faina","lapte","cacao","alune", "nuca"}', False, 'cozonac-zburator.jpg'),

('Brioșe', 'Aluat pufos, cu bucățele de ciocolată. Bucățelele de ciocolata, însă, nu sunt tocmai pufoase.', 8 , 145, 320, 'patiserie', 'comuna', '{"ciocolata","lapte","unt","migdale","faina","zahar"}', False, 'briose.jpg'),

('Turtă dulce', 'Un produs bun de savurat de Craciun. Sau și mai târziu dacă stocul a depășit cererea. De obicei mai găsiți și prin iunie...', 12 , 400, 550, 'patiserie', 'aniversara', '{"faina","lapte","scortisoara","zahar","unt"}', False, 'turta-dulce.jpg'),

('Turtă dulce dietetică', 'Îndulcitor în loc de zahăr. Dar nu vă lăsați păcăliți de nume, în rest nimic nu-i dietetic.', 10 , 400, 520, 'patiserie', 'aniversara', '{"faina","lapte","zaharina","unt","scortisoara"}', True, 'turta-dulce-dietetica.jpg'),

('Căsuță din turtă dulce', 'Vine cu tot cu vrăjitoare și cuptor la pachet. A nu se lăsa în mijlocul pădurii.', 70 , 450, 2700, 'patiserie', 'aniversara', '{"unt","scortisoara", "oua","faina","lapte","zahar"}', False, 'casuta-turta-dulce.jpg'),

('Croissant', 'Un răsfăț pufos și dulce... mda... dulce... dacă nu încurcă Dorelina, iar, sarea cu zahărul!!!', 5 , 150, 285, 'patiserie', 'comuna', '{"faina","lapte","zahar/sare","unt","ciocolata","migdale"}', False, 'croissant.jpg'),

('Prajitura căpșuni', 'Prăjitura se face doar cu comandă specială, fiindcă apoi o comandăm și noi la rândul nostru la cofetăria vecină.', 15 , 180, 385, 'cofetarie', 'comanda speciala', '{"faina","lapte","zahar", "capsuni","unt","gelatina"}', False, 'prajitura-capsuni.jpg'),

('Nasturei cu dulceață', 'Pentru când năstureii normali cedează fiindcă ați mâncat prea multă dulceață', 20.5 , 350, 700, 'patiserie', 'comuna', '{"migdale", "faina","lapte","zahar","unt","dulceata"}', False, 'nasturei-dulceata.jpg'),


('Bomboane de ciocolată pe băț', 'Bățul e cel comestibil, nu bomboana.', 6, 100, 210,'cofetarie', 'pentru copii', '{"ciocolata", "zahar", "lapte", "alune", "faina"}', False, 'bomboane-ciocolata-bat.jpg'),

('Înghețată fumătoare', 'Din când în când, tușește... Dar nu are COVID!', 18.5 , 225, 370, 'gelaterie', 'comuna', '{"smantana","lapte","migdale", "dulceata","zahar","vanilie","ciocolata", "frisca"}', False, 'inghetata-fumatoare.jpg'),


('Înghețată multicoloră', 'Când storci un curcubeu peste înghețată... Ediție limitată; fabricăm doar după ploaie.', 12 , 120, 270, 'gelaterie', 'editie limitata', '{"smantana","lapte","migdale", "dulceata","zahar","vanilie","ciocolata", "frisca"}', False, 'inghetata-multicolora.jpg'),


('Brioșă cu înghețată', 'Nu încercam să fim creativi... Dorelina a încurcat iar rețetele. Măcar are culoare roz', 14 , 235, 340, 'gelaterie', 'pentru copii', '{"frisca", "smantana", "lapte", "ceva roz", "faina","zahar","vanilie"}', False, 'briosa-inghetata.jpg'),

('Înghețată generică', 'Când bușim așa de tare rețeta încât nu se mai încadrează în niuna dintre celelalte categorii.', 8, 90, 130, 'gelaterie','comuna','{"frisca", "smantana", "lapte", "ceva roz", "faina","zahar","vanilie"}', False, 'inghetata-generica.jpg'),

('Imagine cu înghețată', 'Pentru cei aflați la dietă.', 5, 10,10,'gelaterie', 'comuna', '{"hârtie", "tuș"}', False, 'imagine-cu-inghetata.jpg'),


('Bomboane colorate', 'Pentru copiii care doresc să afle devreme cum e o vizită la dentist.', 7, 150,340,'cofetarie', 'pentru copii', '{"zahar", "ciocolata","lapte"}', False, 'bomboane-colorate.jpg');


INSERT into discuri (nume, descriere, pret, marime, tip_produs, categorie, artist, genuri, imagine) VALUES 
('American Football (LP1)', 'Album de calitate superioara', 120 , 12, 'math-rock', 'viniluri', 'American Football', '{Midwest-Emo","Math-Rock"}', 'americanfootball_lp1_300x300.jpg')
('Drag It Down On You', 'Album de calitate superioara', 120 , 12, 'punk', 'viniluri', 'Ceres', '{Alternative", "Indie", "Punk"}', 'ceres_dragitdownonyou_300x300.jpg')
('Charmer', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Charmer', '{Midwest-Emo","Math-Rock","Pop-Punk"}', 'charmer_charmer_300x300.jpg')
('Ivy', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Charmer', '{Midwest-Emo","Math-Rock","Pop-Punk"}', 'charmer_Ivy_300x300.jpg')
('Eternity, In Your Arms', 'Album de calitate superioara', 120 , 12, 'pop-punk', 'viniluri', 'Creeper', '{"Pop-Punk", "Punk"}', 'creeper_eternityinyourarms_300x300.jpg')
('Cine Ar Castiga Daca S-ar Bate Dacii Cu Samuraii?', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Harbours And Towers', '{Midwest-Emo","Math-Rock","Pop-Punk"}', 'harboursandtowers_daciisisamuraii_300x300.jpg')
('Those Days Are Gone', 'Album de calitate superioara', 120 , 12, 'midwest-emo', 'viniluri', 'Free Throw', '{Midwest-Emo","Math-Rock","Pop-Punk"}', 'freethrow_thosedaysaregone_300x300.jpg')