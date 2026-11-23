const APP_VERSION = '0.10.14';
const EDICAO = 2026;
const RODADA_ATUAL = 1;

const ROUND_META = {
  1: {
    1: { titulo: 'A surpresa no pátio', palavras: 99, letra: 'BASTÃO' },
    2: { titulo: 'O desafio da porta verde', palavras: 190, letra: 'BASTÃO' }
  }
};

const STUDENTS = [{"id": "86873", "nome": "ANA CLARA SANTOS PATZOLD", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "84903", "nome": "BIANCA MANUELLA DA SILVA DE OLIVEIRA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "106000", "nome": "CARLOS MIGUEL DA COSTA ROCHA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "100640", "nome": "DIOVANNA ANDRADE SANTOS", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "92599", "nome": "HERCULES BERNARDO DOS SANTOS DA SILVA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "89387", "nome": "ISADORA MALTA GOMES", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "87211", "nome": "JAMILY MANUELA FONSECA DE SOUZA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "83496", "nome": "JOAO PAULO DOS SANTOS FRAGA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "87319", "nome": "LÍVIA FERNANDA SILVA RAMOS", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "84859", "nome": "MARIA FERNANDA DE SOUZA PEREIRA DA SILVA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "84268", "nome": "MATHEUS ENRIQUE DOS SANTOS DA SILVA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "87301", "nome": "MIGUEL JOSEFINO DE MATOS", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "139187", "nome": "PEDRO HENRIQUE DUARTE MARTINS", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "85689", "nome": "POLIANA NEUMANN BAUMHARDT", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "84811", "nome": "RICARDO GARCIA PIETSCH", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "137484", "nome": "RICHARD CRISTIAN ROHDE DE ABREU", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "87298", "nome": "VALENTINA PRATES GOULART", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "83853", "nome": "VITOR RAFAEL HOFF MARQUES", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "105394", "nome": "YSADORA MACHADO FRAGA", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "87300", "nome": "YURI JOSEFINO DE MATTOS", "turma": "21", "ano": 2, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "74838", "nome": "ALEXSANDER LOPES DE OLIVEIRA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "140591", "nome": "ANTHONY MARTINS DA SILVA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "56052", "nome": "ANTÔNIA ROSSET DOS SANTOS LEIRIA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "140586", "nome": "ARTHUR GABRIEL MARTINS DA SILVA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "60066", "nome": "CAIO BOHMGAHREN VARGAS", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "109676", "nome": "CAROLINA SANTOS GONÇALVES", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "54873", "nome": "ELIEL FILIPE DA SILVA VIEIRA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "59769", "nome": "HENRIQUE GELLER CORRÊA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "68309", "nome": "IRIS VITIELLI DOS SANTOS DE MATTOS", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "84901", "nome": "ISAAC PINHEIRO DE LIMA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "55452", "nome": "ISABELLA LIMA DE FRAGA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "55894", "nome": "JULIA OLIVEIRA PASSOS", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "56181", "nome": "KAÍQUE KENDZESKI ANDRADE", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "127405", "nome": "KYARA CONCEIÇÃO CORRÊA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "56378", "nome": "LAURA BEATRIZ BRINQUES VIEGAS", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "60802", "nome": "LAUREN SILVA DA SILVA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "57380", "nome": "LUIZ GUSTAVO TOLEDO URBANSKI", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "76019", "nome": "LUNA VICTÓRIA GRANVILLE DE MATOS", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "12000", "nome": "MARIA EDUARDA BALLEJO ALBERDANHA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "63962", "nome": "MARIA GABRIELA ROLDÃO GONÇALVES", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "109566", "nome": "MARIA HELENA CANUTO SANTOS", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "67981", "nome": "RAISSA VITÓRIA ANDRADE OLIVEIRA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "55746", "nome": "SOPHIA EMANUELY FERREIRA PINHEIRO", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "86955", "nome": "THAINA PEDROSO MOREM", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "76288", "nome": "YASMIN VIVIANE FONSECA DE SOUZA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "87310", "nome": "ZION BENJAMIN DOS SANTOS DE OLIVEIRA", "turma": "31", "ano": 3, "categoria": 1, "edicao": 2026, "status": "ATIVO"}, {"id": "54676", "nome": "ALICE FLORES DA SILVA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "65618", "nome": "AMANDA PERES BRAZ DA SILVA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "10577", "nome": "ANA LUISA SANTOS DE FRAGA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "10861", "nome": "ANTHONIA DA SILVA LUCAS", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "5677", "nome": "BENJAMIN ZUANAZZI DE LIMA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "55719", "nome": "BÁRBARA DOS SANTOS CLITO DA SILVA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "62940", "nome": "CLÉVERSON GOMES DA SILVA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "3902", "nome": "DORIAN MAGAIVER OLIVEIRA DE LIMA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "13680", "nome": "EMANUELLE PRATES GUIMARÃES", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "66707", "nome": "EMANUELLY GOMES CARVALHO", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "57490", "nome": "GUILHERME TRINDADE SOARES", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "135696", "nome": "HENRIQUE SANTOS MOREIRA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "54528", "nome": "HISYS SILVEIRA LUCAS", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "90006", "nome": "IAGO ALMEIDA RODRIGUES", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "6715", "nome": "ISADORA VITÓRIA ALVES AMARAL", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "15637", "nome": "IZADORA DE SOUZA BARBOSA DOMINGUES", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "9068", "nome": "JADY DRUM SILVA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "59679", "nome": "JOÃO FILIPE DA ROCHA SANTOS", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "13815", "nome": "LIVIA SILVA CAMPOS", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "13966", "nome": "LUDMILA DE BITENCOURTE VIEGAS", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "71504", "nome": "LUÍS GUSTAVO SOARES MALTA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "2326", "nome": "MAYCON RYAN GARCIA DE SOUZA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "22780", "nome": "MELISSA DE SOUZA CASTRO", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "67416", "nome": "MIGUEL MACHADO ARAÚJO", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "78565", "nome": "MURILO NUNES MAIA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "128373", "nome": "PÉROLA DOS SANTOS OLIVEIRA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "15351", "nome": "RICHARLISSON PEREIRA PRUX", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "15695", "nome": "SOPHIA MARTIN GAMA", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "20354", "nome": "THAWAN MIGUEL DA SILVA CAVALHEIRO", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "15797", "nome": "VINICIUS JARUTAIS VIEGAS", "turma": "41", "ano": 4, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "16320", "nome": "ALANA IRIBARREM DE VARGAS", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "16130", "nome": "ANA LAURA RAUPP SOUZA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "140286", "nome": "ANTONIA STENGER FRAGA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "42844", "nome": "ARTHUR MALTA PAVÃO", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "60675", "nome": "BERNARDO DA SILVA GODOI", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "16672", "nome": "BERNARDO RIBEIRO FRAGA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "16945", "nome": "BRAYAN SILVA DA SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "27591", "nome": "DEBORA DA SILVA MACHADO", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "135648", "nome": "EDUARDA CHAGAS MEDINA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "17206", "nome": "EDUARDA OLIVEIRA DE OLIVEIRA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "66937", "nome": "ESTELLA MOURA ANTONIO", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "12813", "nome": "EVA APARECIDA SILVEIRA DA SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "42875", "nome": "GUSTAVO TRINDADE SOARES", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "42807", "nome": "JOAO VICTOR DA SILVA COELHO", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "17271", "nome": "JULIANA ANDRADE MORAIS", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "17328", "nome": "KAMILLY DOS SANTOS CLITO DA SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "23674", "nome": "KASSIANE ROSA SILVEIRA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "67155", "nome": "KEMILLI LEMOS DA SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "29792", "nome": "LARA DOMINGUES NUNES", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "42571", "nome": "LARISSA DA LUZ SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "73058", "nome": "MAYZA TEIXEIRA DORNELES", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "17665", "nome": "MIGUEL BARCELOS SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "6847", "nome": "MONIQUE DOS SANTOS FISCHER", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "17720", "nome": "MYSAEL SCHULZ DE FRAGA SILVA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "45328", "nome": "SHAWAN GABRIEL DA SILVA CAVALHEIRO", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "12404", "nome": "SOFIA SANHUDO MALTA", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "26443", "nome": "WESLLEY NEUMANN SANTOS", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "112604", "nome": "ÉVELIN BRUNA RODRIGUES HORLE", "turma": "51", "ano": 5, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "48786", "nome": "AINAT BALLEJO ALBERDANHA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "20254", "nome": "ALYCE ANDRADE SANTOS", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "76268", "nome": "ANITA SCHÜTZER", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "125245", "nome": "ARIÉLLY LAMARQUE PORTELA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "19800", "nome": "ARTHUR MARTIN GAMA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "17401", "nome": "EDUARDO VIEIRA FEIJÓ", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "16791", "nome": "GYAN PAULO TELES GOULART", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "36278", "nome": "INGRID FRANCO DE FARIAS", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "110983", "nome": "ISABELLA EBERTZ KOVASKI", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "23166", "nome": "JOAO VITOR GOMES DE FRAGA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "117567", "nome": "JOSÉ ARMANDO SCHÜTZER", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "23298", "nome": "JOÃO PEDRO PEREIRA DE AVILA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "23416", "nome": "JULIA JARUTAIS VIEGAS", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "13297", "nome": "KAUÊ JÚNIOR KENDZESKI ANDRADE", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "128287", "nome": "LAVÍNIA DA ROCHA STREVENSKI", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "28346", "nome": "LEONARDO DE SOUZA CASTRO", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "15518", "nome": "LUAN MOREIRA BONASSA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "25584", "nome": "LUIZ MIGUEL DE SOUZA RODRIGUES", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "24639", "nome": "LÍVIA MARTIN GAMA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "16348", "nome": "MARCIEL BUENO DE SOUZA JÚNIOR", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "114914", "nome": "MELANY PRESTES FALLER", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "19828", "nome": "MURILLO RAFAEL BENTO", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "24704", "nome": "MYGUEL SCHULZ DE FRAGA SILVA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "25225", "nome": "PAULA FERREIRA DE CARVALHO", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "15986", "nome": "PIETRA SANHUDO MALTA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "124956", "nome": "RAYANE ANDRADE DE SOUZA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "137003", "nome": "RAYANE DOS SANTOS MARTINS", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "30246", "nome": "RICHARD CORREA PEREIRA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "25278", "nome": "SAIMON MADRID NUNES", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "28658", "nome": "SOFIA MARQUES LOURENÇO", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "30288", "nome": "THAIANY JESUS DE FRAGA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "25617", "nome": "VINICIUS NAYSINGER DA SILVA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}, {"id": "26177", "nome": "VINYCIUS GABRYEL DE FRAGA SANTANA", "turma": "61", "ano": 6, "categoria": 2, "edicao": 2026, "status": "ATIVO"}];

function doGet(e) {
  const out = HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Brasileirão da Fluência — CVS 2026')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');

  // O modo embed é usado apenas pelo invólucro HTTPS externo que captura o microfone.
  // O admin continua abrindo diretamente pelo Apps Script, sem necessidade de iframe.
  const params = (e && e.parameter) ? e.parameter : {};
  if (String(params.embed || '') === '1') {
    out.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return out;
}

function setupBrasileirao() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('America/Sao_Paulo');

  ensureSheet_(ss, 'Alunos', [
    'ID_Educar_Web','Nome','Turma','Ano','Categoria','Edição','Status'
  ]);
  ensureSheet_(ss, 'Leituras', [
    'Leitura_ID','ID_Educar_Web','Nome','Turma','Categoria','Edição','Rodada','Leitura',
    'Texto','Palavras_Texto','Palavras_Lidas','Concluiu_Texto','Avaliador',
    'Início','Fim','Duração_s','PPM','Precisão_%','Prosódia','Ritmo','Precisão_Nota',
    'Total_9','Autocorreções','Erros','Status','Áudio_Ref','Observações'
  ]);
  ensureSheet_(ss, 'Rascunhos', [
    'Rascunho_ID','ID_Educar_Web','Nome','Turma','Categoria','Rodada','Leitura',
    'Avaliador','Início','Fim','Duração_s','Status','Atualizado_em'
  ]);
  ensureSheet_(ss, 'Historico_Admin', [
    'Evento_ID','Data_Hora','ID_Educar_Web','Nome','Turma','Rodada','Leitura',
    'Ação','Motivo','Valor_Anterior','Valor_Novo','Observação'
  ]);
  ensureSheet_(ss, 'Snapshots_Ranking', [
    'Snapshot_ID','Data_Hora','Categoria','ID_Educar_Web','Nome','Turma',
    'Pontos_Acumulados','Posição','Posição_Anterior','Variação','Melhor_Posição',
    'Pior_Posição','Entrou_Top20','Saiu_Top20'
  ]);
  ensureSheet_(ss, 'Config', ['Chave','Valor','Observação']);
  ensureSnapshotSchema_(ss);

  const alunos = ss.getSheetByName('Alunos');
  if (alunos.getLastRow() <= 1) {
    const values = STUDENTS.map(s => [
      s.id, s.nome, s.turma, s.ano, s.categoria, s.edicao, s.status
    ]);
    alunos.getRange(2, 1, values.length, 7).setValues(values);
  }

  const config = ss.getSheetByName('Config');
  if (config.getLastRow() <= 1) {
    const vals = [
      ['Edição', 2026, '1ª edição'],
      ['Rodada_Atual', 1, ''],
      ['Leituras_por_Rodada', 2, ''],
      ['Máx_Pontos_por_Leitura', 9, 'Prosódia 0-3 + Ritmo 0-3 + Precisão 0-3'],
      ['Máx_Pontos_por_Rodada', 18, ''],
      ['Máx_Pontos_Campeonato', 54, '3 rodadas'],
      ['Rodada_1_Cat1_Texto', 'A surpresa no pátio', '99 palavras | letra bastão'],
      ['Rodada_1_Cat2_Texto', 'O desafio da porta verde', '190 palavras | letra bastão'],
      ['Desempate_1', 'PPM', 'palavras por minuto'],
      ['Desempate_2', 'Precisão', ''],
      ['Desempate_3', 'Prosódia', ''],
      ['Desempate_4', 'Ritmo', ''],
      ['Desempate_5', 'Autocorreções corretas', ''],
      ['Desempate_final', 'Ajuste manual da equipe', ''],
      ['PIN_Avaliador', '482731', 'PIN de acesso ao aplicativo do avaliador. Pode ser alterado a qualquer momento nesta aba.'],
      ['PIN_Admin', '73190428', 'PIN exclusivo do painel administrativo. Pode ser alterado a qualquer momento nesta aba.']
    ];
    config.getRange(2, 1, vals.length, 3).setValues(vals);
  }

  // Garante o PIN de acesso mesmo em bases já existentes antes da v0.3.
  if (!getConfigValue_(ss, 'PIN_Avaliador')) {
    config.appendRow(['PIN_Avaliador', '482731', 'PIN de acesso ao aplicativo do avaliador. Pode ser alterado a qualquer momento nesta aba.']);
  }
  if (!getConfigValue_(ss, 'PIN_Admin')) {
    config.appendRow(['PIN_Admin', '73190428', 'PIN exclusivo do painel administrativo. Pode ser alterado a qualquer momento nesta aba.']);
  }

  styleSheets_(ss);
  return { ok: true, alunos: STUDENTS.length, version: APP_VERSION };
}

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0 || sh.getRange(1,1).getValue() === '') {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function ensureSnapshotSchema_(ss) {
  const sh = ensureSheet_(ss, 'Snapshots_Ranking', [
    'Snapshot_ID','Data_Hora','Categoria','ID_Educar_Web','Nome','Turma',
    'Pontos_Acumulados','Posição','Posição_Anterior','Variação','Melhor_Posição',
    'Pior_Posição','Entrou_Top20','Saiu_Top20','Rodada','Edição'
  ]);
  const wanted = ['Rodada','Edição'];
  if (sh.getMaxColumns() < 16) sh.insertColumnsAfter(sh.getMaxColumns(), 16 - sh.getMaxColumns());
  const h15 = String(sh.getRange(1,15).getValue() || '').trim();
  const h16 = String(sh.getRange(1,16).getValue() || '').trim();
  if (h15 !== wanted[0]) sh.getRange(1,15).setValue(wanted[0]);
  if (h16 !== wanted[1]) sh.getRange(1,16).setValue(wanted[1]);
  return sh;
}

function styleSheets_(ss) {
  ['Alunos','Leituras','Rascunhos','Historico_Admin','Snapshots_Ranking','Config'].forEach(name => {
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const lastCol = Math.max(1, sh.getLastColumn());
    sh.getRange(1,1,1,lastCol)
      .setBackground('#173A63')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
    sh.autoResizeColumns(1, lastCol);
  });
}

function getConfigValue_(ss, key) {
  const sh = ss.getSheetByName('Config');
  const lr = sh.getLastRow();
  if (lr < 2) return '';
  const vals = sh.getRange(2,1,lr-1,2).getValues();
  const row = vals.find(r => String(r[0]).trim() === String(key));
  return row ? String(row[1]).trim() : '';
}

function loginEvaluator(pin) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const expected = getConfigValue_(ss, 'PIN_Avaliador');
  if (!expected) throw new Error('PIN do avaliador não configurado.');
  if (String(pin || '').trim() !== expected) throw new Error('PIN inválido.');
  const token = 'A-' + Utilities.getUuid();
  CacheService.getScriptCache().put('auth_' + token, 'OK', 21600); // até 6 horas
  return {ok:true, token, version:APP_VERSION};
}

function requireEvaluator_(token) {
  const t = String(token || '').trim();
  if (!t || CacheService.getScriptCache().get('auth_' + t) !== 'OK') {
    throw new Error('Acesso expirado ou não autorizado. Informe o PIN novamente.');
  }
}

function loginAdmin(pin) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const expected = getConfigValue_(ss, 'PIN_Admin');
  if (!expected) throw new Error('PIN administrativo não configurado.');
  if (String(pin || '').trim() !== expected) throw new Error('PIN administrativo inválido.');
  const token = 'ADM-' + Utilities.getUuid();
  CacheService.getScriptCache().put('admin_' + token, 'OK', 21600); // até 6 horas
  return {ok:true, token, version:APP_VERSION};
}

function requireAdmin_(token) {
  const t = String(token || '').trim();
  if (!t || CacheService.getScriptCache().get('admin_' + t) !== 'OK') {
    throw new Error('Acesso administrativo expirado ou não autorizado. Informe o PIN novamente.');
  }
}

function getAppState(turma, authToken) {
  requireEvaluator_(authToken);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const alunos = readStudents_(ss, turma);
  const statusMap = readStatusMap_(ss);
  const rows = alunos.map(s => {
    const st = statusMap[s.id] || {l1:false,l2:false};
    return Object.assign({}, s, {
      l1: st.l1,
      l2: st.l2,
      next: !st.l1 ? 1 : (!st.l2 ? 2 : null)
    });
  });
  const done = rows.filter(x => x.next === null).length;
  return {
    version: APP_VERSION,
    rodada: RODADA_ATUAL,
    turma: turma || '',
    students: rows,
    total: rows.length,
    concluido: done,
    pendente: rows.length - done
  };
}

function readStudents_(ss, turma) {
  const sh = ss.getSheetByName('Alunos');
  const lr = sh.getLastRow();
  if (lr < 2) return [];
  const vals = sh.getRange(2,1,lr-1,7).getValues();
  return vals
    .filter(r => String(r[6]).toUpperCase() === 'ATIVO')
    .filter(r => !turma || String(r[2]) === String(turma))
    .map(r => ({
      id: String(r[0]), nome: String(r[1]), turma: String(r[2]),
      ano: Number(r[3]), categoria: Number(r[4]), edicao: Number(r[5])
    }))
    .sort((a,b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function readStatusMap_(ss) {
  const sh = ss.getSheetByName('Leituras');
  const lr = sh.getLastRow();
  const map = {};
  if (lr < 2) return map;
  const vals = sh.getRange(2,1,lr-1,27).getValues();
  vals.forEach(r => {
    if (String(r[24]).toUpperCase() !== 'SALVO') return;
    if (Number(r[6]) !== RODADA_ATUAL) return;
    const id = String(r[1]);
    if (!map[id]) map[id] = {l1:false,l2:false};
    const l = Number(r[7]);
    if (l === 1) map[id].l1 = true;
    if (l === 2) map[id].l2 = true;
  });
  return map;
}


/**
 * v0.10.14 — L2 POR SÉRIE
 * Roteamento: ID Educar Web -> L2_Alocacao_Alunos -> Texto_ID -> L2_Textos_Serie.
 * L1 permanece com o comportamento histórico.
 */
function BF1014_metaForReading_(ss, student, leitura) {
  const l = Number(leitura);
  if (l === 2) {
    const meta = BF1014_getL2MetaForStudent_(ss, student.id, RODADA_ATUAL, l);
    if (!meta) {
      throw new Error('A L2 ainda não está liberada/configurada para este aluno.');
    }
    return meta;
  }

  const byRound = ROUND_META[RODADA_ATUAL] || {};
  const meta = byRound[Number(student.categoria)];
  if (!meta) throw new Error('Texto canônico da leitura não encontrado.');
  return meta;
}

function BF1014_getL2MetaForStudent_(ss, studentId, rodada, leitura) {
  const shAlloc = ss.getSheetByName('L2_Alocacao_Alunos');
  const shText = ss.getSheetByName('L2_Textos_Serie');
  if (!shAlloc || !shText) return null;

  const ad = shAlloc.getDataRange().getValues();
  if (ad.length < 2) return null;
  const ah = BF1014_headerMap_(ad[0]);

  let alloc = null;
  for (let r = 1; r < ad.length; r++) {
    if (
      String(ad[r][ah.ID_Educar_Web]) === String(studentId) &&
      Number(ad[r][ah.Rodada]) === Number(rodada) &&
      Number(ad[r][ah.Leitura]) === Number(leitura)
    ) {
      alloc = {
        textoId: String(ad[r][ah.Texto_ID] || ''),
        ano: Number(ad[r][ah.Ano] || 0),
        turma: String(ad[r][ah.Turma] || '')
      };
      break;
    }
  }
  if (!alloc || !alloc.textoId) return null;

  const td = shText.getDataRange().getValues();
  if (td.length < 2) return null;
  const th = BF1014_headerMap_(td[0]);

  for (let r = 1; r < td.length; r++) {
    const status = String(td[r][th.Status] || '').toUpperCase();
    if (
      String(td[r][th.Texto_ID] || '') === alloc.textoId &&
      Number(td[r][th.Rodada]) === Number(rodada) &&
      Number(td[r][th.Leitura]) === Number(leitura) &&
      Number(td[r][th.Ano]) === Number(alloc.ano) &&
      status === 'ATIVO'
    ) {
      return {
        titulo: String(td[r][th['Título']] || ''),
        palavras: Number(td[r][th.Palavras_Analise] || 0),
        palavrasPrefeitura: Number(td[r][th.Palavras_Prefeitura] || 0),
        letra: 'BASTÃO',
        textoId: alloc.textoId,
        ano: alloc.ano
      };
    }
  }
  return null;
}

function BF1014_headerMap_(headers) {
  const out = {};
  headers.forEach((v, i) => out[String(v)] = i);
  return out;
}

function getStudentContext(studentId, authToken) {
  requireEvaluator_(authToken);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const student = readStudents_(ss).find(s => s.id === String(studentId));
  if (!student) throw new Error('Aluno não encontrado.');
  const status = readStatusMap_(ss)[student.id] || {l1:false,l2:false};
  const next = !status.l1 ? 1 : (!status.l2 ? 2 : null);
  const meta = BF1014_metaForReading_(ss, student, next);
  return {
    student, next, rodada: RODADA_ATUAL, meta,
    data: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')
  };
}

function beginReading(studentId, evaluator, authToken) {
  requireEvaluator_(authToken);
  if (!String(evaluator || '').trim()) throw new Error('Digite o nome do avaliador.');
  const ctx = getStudentContext(studentId, authToken);
  if (ctx.next === null) throw new Error('Rodada concluída para este aluno.');

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const cache = CacheService.getScriptCache();
    const key = lockKey_(studentId, RODADA_ATUAL, ctx.next);
    const existing = cache.get(key);
    if (existing) throw new Error('Este aluno está em avaliação em outro aparelho.');
    const token = Utilities.getUuid();
    cache.put(key, token, 600); // 10 min
    return {
      ok: true, token, key,
      student: ctx.student, leitura: ctx.next, rodada: ctx.rodada, meta: ctx.meta,
      startIso: new Date().toISOString()
    };
  } finally {
    lock.releaseLock();
  }
}

function saveDraft(payload, authToken) {
  requireEvaluator_(authToken);
  assertReadingLock_(payload.studentId, payload.rodada, payload.leitura, payload.readingToken);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Rascunhos');
  const id = payload.draftId || ('D-' + Utilities.getUuid());
  sh.appendRow([
    id, payload.studentId, payload.studentName, payload.turma, payload.categoria,
    payload.rodada, payload.leitura, payload.avaliador,
    payload.inicioISO, payload.fimISO, payload.duracao_s,
    'PENDENTE_CONCLUSAO', new Date()
  ]);
  return {ok:true, draftId:id};
}

function saveReading(payload, authToken) {
  requireEvaluator_(authToken);
  assertReadingLock_(payload.studentId, payload.rodada, payload.leitura, payload.readingToken);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const status = readStatusMap_(ss)[String(payload.studentId)] || {l1:false,l2:false};
    if ((Number(payload.leitura) === 1 && status.l1) ||
        (Number(payload.leitura) === 2 && status.l2)) {
      throw new Error('Esta leitura já foi salva.');
    }

    const student = readStudents_(ss).find(s => String(s.id) === String(payload.studentId));
    if (!student) throw new Error('Aluno não encontrado.');
    const meta = BF1014_metaForReading_(ss, student, Number(payload.leitura));
    const duration = Number(payload.duracao_s) || 0;
    const words = Number(payload.palavrasLidas) || 0;
    const ppm = duration > 0 ? (words / duration * 60) : '';

    const readingId = 'L-' + Utilities.getUuid();
    ss.getSheetByName('Leituras').appendRow([
      readingId,
      payload.studentId,
      payload.studentName,
      payload.turma,
      Number(payload.categoria),
      EDICAO,
      RODADA_ATUAL,
      Number(payload.leitura),
      meta.titulo,
      meta.palavras,
      words,
      !!payload.concluiuTexto,
      payload.avaliador,
      payload.inicioISO,
      payload.fimISO,
      duration,
      ppm,
      '', '', '', '', '', '', '',
      'SALVO',
      '',
      ''
    ]);

    if (payload.draftId) markDraftDone_(ss, payload.draftId);
    releaseReadingLock_(payload.studentId, RODADA_ATUAL, payload.leitura);

    return {
      ok:true, readingId,
      message:'LEITURA CONCLUÍDA E SALVA',
      status: Number(payload.leitura) === 1 ? '✓ L1' : '✓ L1 ✓ L2'
    };
  } finally {
    lock.releaseLock();
  }
}

function markDraftStatus_(ss, draftId, status) {
  if (!draftId) return;
  const sh = ss.getSheetByName('Rascunhos');
  const lr = sh.getLastRow();
  if (lr < 2) return;
  const ids = sh.getRange(2,1,lr-1,1).getValues().flat().map(String);
  const idx = ids.lastIndexOf(String(draftId));
  if (idx >= 0) sh.getRange(idx+2,12).setValue(status);
}

function markDraftDone_(ss, draftId) {
  markDraftStatus_(ss, draftId, 'CONCLUÍDO');
}

function cancelReading(studentId, leitura, authToken, draftId, readingToken) {
  requireEvaluator_(authToken);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (draftId) markDraftStatus_(ss, draftId, 'CANCELADO');
  releaseReadingLock_(studentId, RODADA_ATUAL, leitura, readingToken);
  return {ok:true};
}

function releaseReadingLock_(studentId, rodada, leitura, readingToken) {
  const cache = CacheService.getScriptCache();
  const key = lockKey_(studentId, rodada, leitura);
  if (readingToken) {
    const current = cache.get(key);
    if (current && String(current) !== String(readingToken)) return false;
  }
  cache.remove(key);
  return true;
}

function lockKey_(studentId, rodada, leitura) {
  return ['reading', studentId, rodada, leitura].join('_');
}

function assertReadingLock_(studentId, rodada, leitura, readingToken) {
  const key = lockKey_(studentId, rodada, leitura);
  const current = CacheService.getScriptCache().get(key);
  if (!readingToken || !current || String(current) !== String(readingToken)) {
    throw new Error('Esta leitura foi liberada pela coordenação ou a sessão expirou. Volte à turma e inicie novamente.');
  }
}

function readAllReadings_(ss) {
  const sh = ss.getSheetByName('Leituras');
  const lr = sh.getLastRow();
  if (lr < 2) return [];
  return sh.getRange(2,1,lr-1,27).getValues().map((r,i) => ({
    row: i + 2,
    id: String(r[0]), studentId: String(r[1]), nome: String(r[2]), turma: String(r[3]),
    categoria: Number(r[4]), edicao: Number(r[5]), rodada: Number(r[6]), leitura: Number(r[7]),
    texto: String(r[8]), palavrasTexto: Number(r[9]), palavrasLidas: Number(r[10]),
    concluiuTexto: r[11] === true || String(r[11]).toUpperCase() === 'TRUE',
    avaliador: String(r[12] || ''), inicio: r[13], fim: r[14], duracao: Number(r[15]) || 0,
    ppm: r[16] === '' ? null : Number(r[16]), precisaoPct: r[17] === '' ? null : Number(r[17]),
    prosodia: r[18] === '' ? null : Number(r[18]), ritmo: r[19] === '' ? null : Number(r[19]),
    precisaoNota: r[20] === '' ? null : Number(r[20]), total9: r[21] === '' ? null : Number(r[21]),
    autocorrecoes: r[22] === '' ? null : Number(r[22]), erros: r[23] === '' ? null : Number(r[23]),
    status: String(r[24] || ''), audioRef: String(r[25] || ''), observacoes: String(r[26] || '')
  }));
}

function asDate_(v) {
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function fmtDateTime_(v) {
  const d = asDate_(v);
  if (!d) return '';
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
}


function snapshotRows_(ss) {
  const sh = ensureSnapshotSchema_(ss);
  const lr = sh.getLastRow();
  if (lr < 2) return [];
  return sh.getRange(2,1,lr-1,16).getValues().map(r => ({
    snapshotId:String(r[0]||''), data:r[1], categoria:Number(r[2])||0, studentId:String(r[3]||''),
    nome:String(r[4]||''), turma:String(r[5]||''), pontos:r[6]===''?null:Number(r[6]),
    posicao:r[7]===''?null:Number(r[7]), posAnterior:r[8]===''?null:Number(r[8]),
    variacao:r[9]===''?null:Number(r[9]), melhor:r[10]===''?null:Number(r[10]), pior:r[11]===''?null:Number(r[11]),
    entrou:String(r[12]||'').toUpperCase()==='SIM', saiu:String(r[13]||'').toUpperCase()==='SIM',
    rodada:r[14]===''?null:Number(r[14]), edicao:r[15]===''?null:Number(r[15])
  }));
}

function latestSnapshotGroup_(rows, categoria) {
  const relevant = rows.filter(r => r.categoria===Number(categoria) && (r.edicao===null || r.edicao===EDICAO) && (r.rodada===null || r.rodada===RODADA_ATUAL));
  if (!relevant.length) return [];
  let latestId='', latestTime=-Infinity;
  relevant.forEach(r => {
    const d=asDate_(r.data); const t=d?d.getTime():0;
    if (t>=latestTime) { latestTime=t; latestId=r.snapshotId; }
  });
  return relevant.filter(r => r.snapshotId===latestId);
}

function rankSignature_(rows) {
  return rows.filter(r => r.posicao!==null && r.posicao!==undefined)
    .slice().sort((a,b)=>a.posicao-b.posicao || String(a.id||a.studentId).localeCompare(String(b.id||b.studentId)))
    .map(r => [String(r.id||r.studentId),Number(r.posicao),Number(r.pontos||0)].join('|')).join(';');
}

function snapshotHistoryPositions_(allRows, studentId, categoria, rodadaOnly) {
  return allRows.filter(r => r.studentId===String(studentId) && r.categoria===Number(categoria) && r.posicao!==null &&
    (r.edicao===null || r.edicao===EDICAO) && (!rodadaOnly || r.rodada===null || r.rodada===RODADA_ATUAL))
    .map(r=>Number(r.posicao)).filter(Number.isFinite);
}

function syncRankingSnapshots_(ss, rankingsFull) {
  const sh = ensureSnapshotSchema_(ss);
  let allRows = snapshotRows_(ss);
  const out = {};

  [1,2].forEach(cat => {
    const current = (rankingsFull[String(cat)]||[]).map(x=>Object.assign({},x));
    const prevGroup = latestSnapshotGroup_(allRows, cat);
    const prevCurrent = prevGroup.filter(r=>r.posicao!==null);
    const prevMap = {}; prevCurrent.forEach(r=>prevMap[r.studentId]=r);
    const hadPrevious = prevGroup.length>0;
    const changed = rankSignature_(current)!==rankSignature_(prevCurrent);
    let latestGroup = prevGroup;

    if (changed) {
      const snapId='S-'+Utilities.getUuid(); const now=new Date(); const rowsToAppend=[];
      const currentIds = new Set(current.map(x=>String(x.id)));
      current.forEach(x=>{
        const prev=prevMap[String(x.id)]||null;
        const priorRound=snapshotHistoryPositions_(allRows,x.id,cat,true);
        const priorAll=snapshotHistoryPositions_(allRows,x.id,cat,false);
        const bestRound=Math.min.apply(null, priorRound.concat([x.posicao]));
        const worstRound=Math.max.apply(null, priorRound.concat([x.posicao]));
        const posPrev=prev?prev.posicao:null;
        const variation=posPrev===null?null:(posPrev-x.posicao); // positivo = subiu
        const entered=hadPrevious && x.posicao<=20 && (!prev || prev.posicao>20);
        const exited=hadPrevious && prev && prev.posicao<=20 && x.posicao>20;
        rowsToAppend.push([
          snapId,now,cat,x.id,x.nome,x.turma,x.pontos,x.posicao,posPrev===null?'':posPrev,variation===null?'':variation,
          bestRound,worstRound,entered?'SIM':'',exited?'SIM':'',RODADA_ATUAL,EDICAO
        ]);
      });
      // Registra saídas completas do ranking/Top 20 (ex.: leitura anulada/reaberta).
      if (hadPrevious) prevCurrent.forEach(prev=>{
        if (!currentIds.has(String(prev.studentId)) && prev.posicao<=20) {
          const priorRound=snapshotHistoryPositions_(allRows,prev.studentId,cat,true);
          const bestRound=priorRound.length?Math.min.apply(null,priorRound):prev.posicao;
          const worstRound=priorRound.length?Math.max.apply(null,priorRound):prev.posicao;
          rowsToAppend.push([snapId,now,cat,prev.studentId,prev.nome,prev.turma,0,'',prev.posicao,'',bestRound,worstRound,'','SIM',RODADA_ATUAL,EDICAO]);
        }
      });
      if (rowsToAppend.length) {
        sh.getRange(sh.getLastRow()+1,1,rowsToAppend.length,16).setValues(rowsToAppend);
        latestGroup = rowsToAppend.map(r=>({
          snapshotId:r[0],data:r[1],categoria:Number(r[2]),studentId:String(r[3]),nome:String(r[4]),turma:String(r[5]),pontos:r[6]===''?null:Number(r[6]),
          posicao:r[7]===''?null:Number(r[7]),posAnterior:r[8]===''?null:Number(r[8]),variacao:r[9]===''?null:Number(r[9]),melhor:r[10]===''?null:Number(r[10]),pior:r[11]===''?null:Number(r[11]),
          entrou:String(r[12])==='SIM',saiu:String(r[13])==='SIM',rodada:Number(r[14]),edicao:Number(r[15])
        }));
        allRows=allRows.concat(latestGroup);
      }
    }

    const latestMap={}; latestGroup.filter(r=>r.posicao!==null).forEach(r=>latestMap[r.studentId]=r);
    current.forEach(x=>{
      const m=latestMap[String(x.id)]||null;
      const allPos=snapshotHistoryPositions_(allRows,x.id,cat,false);
      x.posAnterior=m?m.posAnterior:null;
      x.variacao=m?m.variacao:null;
      x.entrouTop20=!!(m&&m.entrou);
      x.saiuTop20=!!(m&&m.saiu);
      x.melhorPosicaoRodada=m&&m.melhor!==null?m.melhor:(allPos.length?Math.min.apply(null,allPos):x.posicao);
      x.piorPosicaoRodada=m&&m.pior!==null?m.pior:(allPos.length?Math.max.apply(null,allPos):x.posicao);
      x.melhorPosicaoHistorica=allPos.length?Math.min.apply(null,allPos):x.posicao;
      x.movimento = x.posAnterior===null ? (hadPrevious?'novo':'base') : (x.variacao>0?'up':(x.variacao<0?'down':'same'));
    });

    const vars=latestGroup.filter(r=>r.posicao!==null && r.variacao!==null);
    const up=vars.filter(r=>r.variacao>0).sort((a,b)=>b.variacao-a.variacao)[0]||null;
    const down=vars.filter(r=>r.variacao<0).sort((a,b)=>a.variacao-b.variacao)[0]||null;
    const entrants=latestGroup.filter(r=>r.entrou && r.posicao!==null).map(r=>r.nome);
    const exits=latestGroup.filter(r=>r.saiu).map(r=>r.nome);
    const d=latestGroup.length?asDate_(latestGroup[0].data):null;
    out[String(cat)]={
      rows:current,
      summary:{
        atualizadoEm:d?fmtDateTime_(d):'',
        maiorSubida:up?{nome:up.nome,posicoes:up.variacao}:null,
        maiorQueda:down?{nome:down.nome,posicoes:Math.abs(down.variacao)}:null,
        entrouTop20:entrants,
        saiuTop20:exits
      }
    };
  });
  return out;
}

function audioExtension_(mimeType) {
  const m = String(mimeType || '').toLowerCase();
  if (m.includes('webm')) return 'webm';
  if (m.includes('ogg')) return 'ogg';
  if (m.includes('mp4') || m.includes('m4a')) return 'm4a';
  if (m.includes('mpeg') || m.includes('mp3')) return 'mp3';
  if (m.includes('wav')) return 'wav';
  return 'webm';
}

function safeFilePart_(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 70) || 'SEM_NOME';
}

function getOrCreateChildFolder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function getAudioFolder_(reading) {
  const rootName = 'Brasileirão da Fluência CVS 2026 — Áudios';
  const roots = DriveApp.getFoldersByName(rootName);
  const root = roots.hasNext() ? roots.next() : DriveApp.createFolder(rootName);
  const round = getOrCreateChildFolder_(root, 'Rodada ' + reading.rodada);
  return getOrCreateChildFolder_(round, 'Turma ' + reading.turma);
}

function saveReadingAudio(readingId, audioPayload, authToken) {
  requireEvaluator_(authToken);
  const payload = audioPayload || {};
  const base64 = String(payload.base64 || '');
  if (!base64) throw new Error('Áudio vazio ou não recebido.');
  if (base64.length > 18 * 1024 * 1024) throw new Error('O áudio ficou grande demais para este envio.');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reading = readAllReadings_(ss).find(r => r.id === String(readingId));
  if (!reading) throw new Error('Leitura não encontrada para vincular o áudio.');
  if (String(reading.status).toUpperCase() !== 'SALVO') throw new Error('Só é possível anexar áudio a uma leitura salva.');

  let bytes;
  try { bytes = Utilities.base64Decode(base64); }
  catch (e) { throw new Error('Não foi possível decodificar o áudio recebido.'); }

  const mimeType = String(payload.mimeType || 'audio/webm');
  const ext = audioExtension_(mimeType);
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  const filename = [
    'CVS', EDICAO, 'R' + reading.rodada, 'L' + reading.leitura,
    'T' + safeFilePart_(reading.turma), safeFilePart_(reading.studentId),
    safeFilePart_(reading.nome), stamp
  ].join('_') + '.' + ext;

  const folder = getAudioFolder_(reading);
  const blob = Utilities.newBlob(bytes, mimeType, filename);
  const file = folder.createFile(blob);
  file.setDescription('Brasileirão da Fluência CVS ' + EDICAO + ' | ' + reading.nome + ' | Turma ' + reading.turma + ' | R' + reading.rodada + '/L' + reading.leitura);

  const ref = file.getId() + '|' + file.getUrl();
  const f = findReadingRow_(ss, readingId);
  f.sh.getRange(f.row, 26).setValue(ref);

  return {ok:true, fileId:file.getId(), url:file.getUrl(), nome:filename, tamanho:bytes.length, audioRef:ref};
}


function getStudentRankingHistory(studentId, categoria, authToken) {
  requireAdmin_(authToken);
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const rows=snapshotRows_(ss).filter(r=>r.studentId===String(studentId) && r.categoria===Number(categoria) && (r.edicao===null || r.edicao===EDICAO));
  const student=readStudents_(ss).find(s=>s.id===String(studentId));
  return {
    nome:student?student.nome:(rows[0]?rows[0].nome:''),
    categoria:Number(categoria),
    historico:rows.sort((a,b)=>{const da=asDate_(a.data),db=asDate_(b.data);return (db?db.getTime():0)-(da?da.getTime():0)}).slice(0,40).map(r=>({
      data:fmtDateTime_(r.data),rodada:r.rodada||RODADA_ATUAL,posicao:r.posicao,pontos:r.pontos,
      posAnterior:r.posAnterior,variacao:r.variacao,entrouTop20:r.entrou,saiuTop20:r.saiu
    }))
  };
}

function getAdminDashboard(authToken) {
  requireAdmin_(authToken);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const students = readStudents_(ss);
  const readings = readAllReadings_(ss);
  const savedCurrent = readings.filter(r => r.status.toUpperCase() === 'SALVO' && r.rodada === RODADA_ATUAL);
  const statusMap = readStatusMap_(ss);

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const readingsToday = savedCurrent.filter(r => {
    const d = asDate_(r.fim);
    return d && Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') === today;
  }).length;

  const turmas = {};
  const categorias = {};
  const pendencias = [];
  const cache = CacheService.getScriptCache();
  let l1Total = 0, l2Total = 0, concluidos = 0, foraSequencia = 0;
  students.forEach(s => {
    const st = statusMap[s.id] || {l1:false,l2:false};
    if (st.l1) l1Total++;
    if (st.l2) l2Total++;
    if (st.l1 && st.l2) concluidos++;
    if (!st.l1 && st.l2) foraSequencia++;
    if (!turmas[s.turma]) turmas[s.turma] = {turma:s.turma,total:0,l1:0,l2:0,concluidos:0,percentual:0};
    const t = turmas[s.turma]; t.total++; if(st.l1)t.l1++; if(st.l2)t.l2++; if(st.l1&&st.l2)t.concluidos++;
    const ck = String(s.categoria);
    if (!categorias[ck]) categorias[ck] = {categoria:s.categoria,total:0,l1:0,l2:0,concluidos:0,percentual:0};
    const c = categorias[ck]; c.total++; if(st.l1)c.l1++; if(st.l2)c.l2++; if(st.l1&&st.l2)c.concluidos++;
    if (!(st.l1 && st.l2)) {
      const leituraPendente = !st.l1 ? 1 : 2;
      const bloqueado = !!cache.get(lockKey_(s.id, RODADA_ATUAL, leituraPendente));
      pendencias.push({
        id:s.id,nome:s.nome,turma:s.turma,categoria:s.categoria,
        pendente:'L'+leituraPendente,bloqueado
      });
    }
  });
  Object.values(turmas).forEach(x => x.percentual = x.total ? Math.round(x.concluidos/x.total*1000)/10 : 0);
  Object.values(categorias).forEach(x => x.percentual = x.total ? Math.round(x.concluidos/x.total*1000)/10 : 0);

  const avaliadoresMap = {};
  savedCurrent.forEach(r => {
    const k = r.avaliador || '(sem nome)';
    if (!avaliadoresMap[k]) avaliadoresMap[k] = {avaliador:k,leituras:0,l1:0,l2:0};
    avaliadoresMap[k].leituras++; if(r.leitura===1)avaliadoresMap[k].l1++; if(r.leitura===2)avaliadoresMap[k].l2++;
  });

  const drafts = ss.getSheetByName('Rascunhos');
  let draftsPendentes = 0;
  if (drafts && drafts.getLastRow() >= 2) {
    draftsPendentes = drafts.getRange(2,12,drafts.getLastRow()-1,1).getValues().flat()
      .filter(v => String(v).toUpperCase() === 'PENDENTE_CONCLUSAO').length;
  }

  const reopened = readings.filter(r => r.status.toUpperCase() === 'REABERTO').length;
  const recent = readings.slice().sort((a,b) => {
    const da = asDate_(a.fim), db = asDate_(b.fim);
    return (db?db.getTime():0)-(da?da.getTime():0);
  }).slice(0,50).map(r => ({
    id:r.id,nome:r.nome,turma:r.turma,categoria:r.categoria,rodada:r.rodada,leitura:r.leitura,
    avaliador:r.avaliador,fim:fmtDateTime_(r.fim),duracao:Math.round(r.duracao*10)/10,
    ppm:r.ppm===null?null:Math.round(r.ppm*10)/10,total9:r.total9,status:r.status,audioRef:r.audioRef
  }));

  const rankings = {};
  const rankingsFull = {};
  const avg_ = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
  const cmpDesc_ = (a,b) => {
    const av = (a===null || a===undefined || Number.isNaN(Number(a))) ? -Infinity : Number(a);
    const bv = (b===null || b===undefined || Number.isNaN(Number(b))) ? -Infinity : Number(b);
    return bv - av;
  };
  const sameRankingCriteria_ = (a,b) =>
    a.pontos === b.pontos &&
    (a.ppmCriterio ?? -Infinity) === (b.ppmCriterio ?? -Infinity) &&
    (a.precisaoCriterio ?? -Infinity) === (b.precisaoCriterio ?? -Infinity) &&
    (a.prosodiaCriterio ?? -Infinity) === (b.prosodiaCriterio ?? -Infinity) &&
    (a.ritmoCriterio ?? -Infinity) === (b.ritmoCriterio ?? -Infinity) &&
    (a.autocorrecoesCriterio ?? -Infinity) === (b.autocorrecoesCriterio ?? -Infinity);

  [1,2].forEach(cat => {
    const rows = students.filter(s => s.categoria===cat).map(s => {
      const rr = readings.filter(r => r.studentId===s.id && r.status.toUpperCase()==='SALVO' && r.total9!==null);
      const points = rr.reduce((acc,r)=>acc+r.total9,0);
      const ppmRaw = avg_(rr.filter(r=>r.ppm!==null).map(r=>r.ppm));
      const precisaoPctRaw = avg_(rr.filter(r=>r.precisaoPct!==null).map(r=>r.precisaoPct));
      const precisaoNotaRaw = avg_(rr.filter(r=>r.precisaoNota!==null).map(r=>r.precisaoNota));
      const prosodiaRaw = avg_(rr.filter(r=>r.prosodia!==null).map(r=>r.prosodia));
      const ritmoRaw = avg_(rr.filter(r=>r.ritmo!==null).map(r=>r.ritmo));
      const autocorrecoesVals = rr.filter(r=>r.autocorrecoes!==null).map(r=>r.autocorrecoes);
      const autocorrecoesTotal = autocorrecoesVals.length ? autocorrecoesVals.reduce((a,b)=>a+b,0) : null;
      return {
        id:s.id,nome:s.nome,turma:s.turma,categoria:cat,pontos:points,leiturasPontuadas:rr.length,
        ppmMedia:ppmRaw===null?null:Math.round(ppmRaw*10)/10,
        ppmCriterio:ppmRaw,
        precisaoCriterio:precisaoPctRaw!==null?precisaoPctRaw:precisaoNotaRaw,
        prosodiaCriterio:prosodiaRaw,
        ritmoCriterio:ritmoRaw,
        autocorrecoesCriterio:autocorrecoesTotal
      };
    }).filter(x => x.leiturasPontuadas>0).sort((a,b)=>
      b.pontos-a.pontos ||
      cmpDesc_(a.ppmCriterio,b.ppmCriterio) ||
      cmpDesc_(a.precisaoCriterio,b.precisaoCriterio) ||
      cmpDesc_(a.prosodiaCriterio,b.prosodiaCriterio) ||
      cmpDesc_(a.ritmoCriterio,b.ritmoCriterio) ||
      cmpDesc_(a.autocorrecoesCriterio,b.autocorrecoesCriterio) ||
      a.nome.localeCompare(b.nome,'pt-BR')
    );

    let pos=0;
    rows.forEach((x,i)=>{
      if(i===0 || !sameRankingCriteria_(x, rows[i-1])) pos=i+1;
      x.posicao=pos;
    });
    rows.forEach((x,i)=>{
      x.empateFinal = (i>0 && sameRankingCriteria_(x,rows[i-1])) || (i<rows.length-1 && sameRankingCriteria_(x,rows[i+1]));
      x.empate = x.empateFinal;
    });
    rankingsFull[String(cat)] = rows;
  });

  const movement = syncRankingSnapshots_(ss, rankingsFull);
  [1,2].forEach(cat => { rankings[String(cat)] = (movement[String(cat)] ? movement[String(cat)].rows : rankingsFull[String(cat)]).slice(0,50); });

  return {
    version:APP_VERSION, edicao:EDICAO, rodada:RODADA_ATUAL,
    resumo:{totalAlunos:students.length,l1:l1Total,l2:l2Total,concluidos,percentual:students.length?Math.round(concluidos/students.length*1000)/10:0,leiturasHoje:readingsToday,audios:savedCurrent.filter(r=>!!r.audioRef).length,rascunhosPendentes:draftsPendentes,reabertas:reopened,foraSequencia},
    turmas:Object.values(turmas).sort((a,b)=>a.turma.localeCompare(b.turma)),
    categorias:Object.values(categorias).sort((a,b)=>a.categoria-b.categoria),
    avaliadores:Object.values(avaliadoresMap).sort((a,b)=>b.leituras-a.leituras || a.avaliador.localeCompare(b.avaliador,'pt-BR')),
    pendencias:pendencias.sort((a,b)=>a.turma.localeCompare(b.turma)||a.nome.localeCompare(b.nome,'pt-BR')),
    recent, rankings, rankingMovement:{'1':movement['1']?movement['1'].summary:{},'2':movement['2']?movement['2'].summary:{}}
  };
}

function findReadingRow_(ss, readingId) {
  const sh = ss.getSheetByName('Leituras');
  const lr = sh.getLastRow();
  if (lr < 2) throw new Error('Nenhuma leitura registrada.');
  const ids = sh.getRange(2,1,lr-1,1).getValues().flat().map(String);
  const idx = ids.indexOf(String(readingId));
  if (idx < 0) throw new Error('Leitura não encontrada.');
  return {sh,row:idx+2};
}

function logAdmin_(ss, data) {
  ss.getSheetByName('Historico_Admin').appendRow([
    'H-' + Utilities.getUuid(), new Date(), data.studentId||'', data.nome||'', data.turma||'',
    data.rodada||'', data.leitura||'', data.acao||'', data.motivo||'',
    data.anterior||'', data.novo||'', data.observacao||''
  ]);
}

function adminScoreReading(readingId, prosodia, ritmo, precisao, autocorrecoes, erros, authToken) {
  requireAdmin_(authToken);
  const p=Number(prosodia), r=Number(ritmo), pr=Number(precisao);
  [p,r,pr].forEach(v=>{ if(!Number.isInteger(v)||v<0||v>3) throw new Error('Prosódia, ritmo e precisão devem ser inteiros de 0 a 3.'); });
  const ac = autocorrecoes===''||autocorrecoes===null||autocorrecoes===undefined ? '' : Number(autocorrecoes);
  const er = erros===''||erros===null||erros===undefined ? '' : Number(erros);
  if(ac!=='' && (!Number.isInteger(ac)||ac<0)) throw new Error('Autocorreções inválidas.');
  if(er!=='' && (!Number.isInteger(er)||er<0)) throw new Error('Erros inválidos.');
  const ss=SpreadsheetApp.getActiveSpreadsheet(); const f=findReadingRow_(ss,readingId); const vals=f.sh.getRange(f.row,1,1,27).getValues()[0];
  if(String(vals[24]).toUpperCase()!=='SALVO') throw new Error('Só é possível pontuar uma leitura com status SALVO.');
  const old=JSON.stringify({prosodia:vals[18],ritmo:vals[19],precisao:vals[20],total:vals[21],autocorrecoes:vals[22],erros:vals[23]});
  const total=p+r+pr;
  f.sh.getRange(f.row,19,1,6).setValues([[p,r,pr,total,ac,er]]);
  logAdmin_(ss,{studentId:vals[1],nome:vals[2],turma:vals[3],rodada:vals[6],leitura:vals[7],acao:'PONTUAÇÃO/VALIDAÇÃO',anterior:old,novo:JSON.stringify({prosodia:p,ritmo:r,precisao:pr,total,autocorrecoes:ac,erros:er})});
  return {ok:true,total};
}

function adminReopenReading(readingId, motivo, authToken) {
  requireAdmin_(authToken);
  if(!String(motivo||'').trim()) throw new Error('Informe o motivo da reabertura.');
  const ss=SpreadsheetApp.getActiveSpreadsheet(); const f=findReadingRow_(ss,readingId); const vals=f.sh.getRange(f.row,1,1,27).getValues()[0];
  if(String(vals[24]).toUpperCase()!=='SALVO') throw new Error('Esta leitura não está com status SALVO.');
  f.sh.getRange(f.row,25).setValue('REABERTO');
  releaseReadingLock_(String(vals[1]),Number(vals[6]),Number(vals[7]));
  logAdmin_(ss,{studentId:vals[1],nome:vals[2],turma:vals[3],rodada:vals[6],leitura:vals[7],acao:'REABRIR LEITURA',motivo:String(motivo).trim(),anterior:'SALVO',novo:'REABERTO'});
  return {ok:true};
}

function adminInvalidateReading(readingId, motivo, authToken) {
  requireAdmin_(authToken);
  if(!String(motivo||'').trim()) throw new Error('Informe o motivo da anulação.');
  const ss=SpreadsheetApp.getActiveSpreadsheet(); const f=findReadingRow_(ss,readingId); const vals=f.sh.getRange(f.row,1,1,27).getValues()[0];
  const prev=String(vals[24]||'');
  f.sh.getRange(f.row,25).setValue('ANULADO');
  releaseReadingLock_(String(vals[1]),Number(vals[6]),Number(vals[7]));
  logAdmin_(ss,{studentId:vals[1],nome:vals[2],turma:vals[3],rodada:vals[6],leitura:vals[7],acao:'ANULAR LEITURA',motivo:String(motivo).trim(),anterior:prev,novo:'ANULADO'});
  return {ok:true};
}

function adminForceCancelStudentReading(studentId, motivo, authToken) {
  requireAdmin_(authToken);
  const reason = String(motivo || '').trim();
  if (!reason) throw new Error('Informe o motivo da liberação.');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const student = readStudents_(ss).find(s => String(s.id) === String(studentId));
  if (!student) throw new Error('Aluno não encontrado.');

  // Libera qualquer L1/L2 que tenha ficado presa em outro aparelho.
  releaseReadingLock_(student.id, RODADA_ATUAL, 1);
  releaseReadingLock_(student.id, RODADA_ATUAL, 2);

  // Se já havia rascunho pendente desse aluno na rodada, encerra-o administrativamente.
  let draftsCancelled = 0;
  const drafts = ss.getSheetByName('Rascunhos');
  if (drafts && drafts.getLastRow() >= 2) {
    const rows = drafts.getRange(2,1,drafts.getLastRow()-1,13).getValues();
    rows.forEach((r,i) => {
      const sameStudent = String(r[1]) === String(student.id);
      const sameRound = Number(r[5]) === RODADA_ATUAL;
      const pending = String(r[11] || '').toUpperCase() === 'PENDENTE_CONCLUSAO';
      if (sameStudent && sameRound && pending) {
        drafts.getRange(i+2,12).setValue('CANCELADO_ADMIN');
        draftsCancelled++;
      }
    });
  }

  logAdmin_(ss,{
    studentId:student.id,nome:student.nome,turma:student.turma,rodada:RODADA_ATUAL,
    acao:'LIBERAR LEITURA/BLOQUEIO',motivo:reason,
    anterior:'EM AVALIAÇÃO / POSSÍVEL BLOQUEIO',novo:'LIBERADO',
    observacao:draftsCancelled ? (draftsCancelled + ' rascunho(s) pendente(s) cancelado(s) administrativamente.') : ''
  });
  return {ok:true,nome:student.nome,draftsCancelled};
}

function getAdminSummary(authToken) {
  return getAdminDashboard(authToken);
}