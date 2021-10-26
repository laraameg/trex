var trex, trex_correndo, bordas, solo, soloInvisivel, imagemDaNuvem, obstaculo, pontuacao, grupoDeNuvens, grupoDeObstaculos, trex_colidiu, morte, pulo, pontos, fonte;
var hi = 0

var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo= JOGAR;

function preload(){
  
  //criar animação do T-Rex correndo
  trex_correndo = loadAnimation('trex1.png','trex3.png','trex4.png');
  
  //criar animação do T-Rex
  trex_colidiu = loadAnimation("trex_colidiu.png");
  
  //carregar imagem do solo
  imagemDoSolo = loadImage("solo2.png");
  
  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvem.png");
  
  // carregar imagens dos obstaculos
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  obstaculo4 = loadImage("obstaculo4.png");
  obstaculo5 = loadImage("obstaculo5.png");
  obstaculo6 = loadImage("obstaculo6.png");
  
  //imagens de final
  imagemFimDoJogo= loadImage("fimDoJogo.png");
  imagemReiniciar= loadImage("reiniciar.png");
  
  morte= loadSound("morte.mp3");
  pulo= loadSound("pulo.mp3");
  pontos=  loadSound("checkPoint.mp3");
  
  fonte= loadFont("fonte.ttf")
}

function setup(){
  
  //cria a tela
  createCanvas(600,200);
  
  //cria bordas
  bordas = createEdgeSprites();
  
  //aprendendo sobre console.log
  //escreve o nome do jogo no terminal
  console.log("T-Rex corredor");
  
  //cria solo
  solo = createSprite(300,190,1200,20);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo)
  solo.x = solo.width/2;
  
  //cria solo invisível
  soloInvisivel = createSprite(300,200,600,10);
  soloInvisivel.visible = false;
  
  //cria sprite do T-Rex
  trex = createSprite(50,100,20,50);
  trex.scale = 0.5;
  trex.x = 50;
  //adiciona a animação de T-Rex correndo ao sprite
  trex.addAnimation('correndo', trex_correndo);
  //adiciona a animação de T-rex colidindo ao sprite
  trex.addAnimation("colidiu" , trex_colidiu);
  
  //atribuir valor inicial à pontuação
  pontuacao = 0
  
  //criar grupos de nuvens e obstáculos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  //adicionar e ajustar imagens do fim
  fimDoJogo = createSprite(300,80,400,20);
  fimDoJogo.addImage(imagemFimDoJogo);

  reiniciar = createSprite(300,120);
  reiniciar.addImage(imagemReiniciar);

  fimDoJogo.scale = 0.5;
  reiniciar.scale = 0.5;
  
  trex.setCollider("circle",0,0);
  
}

function draw(){
  //fundo branco
  background("white");
    
  fill(100);
  textFont(fonte);
  text(pontuacao,550,20);
  
  if(hi>0) {
    fill(150)
    textFont(fonte);
    text("HI "+ hi,480,20);
  }
  //desenha os sprites
  drawSprites();
  
  //Trex colide com o solo
  trex.collide(soloInvisivel);
  
  //estados de jogo
  if(estadoJogo === JOGAR){
    
    //faz o T-Rex correr adicionando velocidade ao solo
    solo.velocityX = -(6+Math.round(pontuacao/20));
    
    //faz o solo voltar ao centro se metade dele sair da tela
    if (solo.x<0){
      solo.x=solo.width/2;
    }
    
    //T-Rex pula ao apertar espaço
    if(keyDown('space') && trex.y>170){
      trex.velocityY = -25; 
      pulo.play();
    }
    
    //gravidade
    trex.velocityY = trex.velocityY + 2;
    
    //gerar nuvens
    gerarNuvens();
    //gerar obstáculos
    gerarObstaculos();
    
    //pontuação continua rodando
    pontuacao = Math.round(pontuacao+frameRate()/60);
    if (pontuacao %100 === 0 && pontuacao > 0) {
      pontos.play();
    }
    
    //imagens do fim ficam invisíveis
    fimDoJogo.visible = false;
    reiniciar.visible = false;
    
    //quando o trex toca o obstáculo, o jogo se encerra
    if(grupoDeObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR;
      morte.play();
    }
  } else if(estadoJogo === ENCERRAR){
    //para os sprites em movimento
    trex.velocityY =0;
    solo.velocityX = 0;
    grupoDeObstaculos.setVelocityXEach(0);
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    
    //animação de T-Rex colidido
    trex.changeAnimation("colidiu" , trex_colidiu);
    
    //mostrar imagens do fim
    fimDoJogo.visible = true;
    reiniciar.visible = true;
    
    if(mousePressedOver(reiniciar)){
      if (hi < pontuacao) {
        hi = pontuacao;
      }
      reinicie();
      
    }
  }
    console.log("estado de jogo: "+estadoJogo);
}

function gerarNuvens(){
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if(frameCount %60 === 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.y = Math.round(random(40,120));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale =0.5;
    //ajustar profundidade da nuvem
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    //dar velocidade e direção à nuvem
    nuvem.velocityX=-3;
    //dar tempo de vida à nuvem
    nuvem.lifetime = 220;
    //adicionar a um grupo
    grupoDeNuvens.add(nuvem);
  }
}

function gerarObstaculos(){
  //criar sprite de obstáculo a cada 60 quadros
  if(frameCount %40 === 0){
    obstaculo = createSprite(600,175,10,40);
    obstaculo.velocityX= -(6+Math.round(pontuacao/20));
  
    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
        	break;
      case 2: obstaculo.addImage(obstaculo2);
        	break;
   	  case 3: obstaculo.addImage(obstaculo3);
        	break;
      case 4: obstaculo.addImage(obstaculo4);
        	break;
      case 5: obstaculo.addImage(obstaculo5);
        	break;
      case 6: obstaculo.addImage(obstaculo6);
        	break;
      default: break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    //ajustar profundidade da nuvem
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth +1;
    //adicionar a um grupo
    grupoDeObstaculos.add(obstaculo);
  }
}
function reinicie(){
  estadoJogo = JOGAR;
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  trex.changeAnimation('correndo', trex_correndo);
  pontuacao = 0;
}