document.addEventListener('DOMContentLoaded', function() {
  // Votre code JavaScript ici
  updateRevenuabbt();
  calculateTaxParts();
  updateParticularSituationOptions();
  calculateredmax();
  calculatemensualité();
  calculateloyer();
   

  // Ajoutez les gestionnaires d'événements ici
  document.getElementById('marital_status').addEventListener('change', calculateTaxParts);
  document.getElementById('childrenCount').addEventListener('change', calculateTaxParts);
  document.getElementById('altChildrenCount').addEventListener('change', calculateTaxParts);
  document.getElementById('particular_situation').addEventListener('change', calculateTaxParts);
  document.getElementById('marital_status').addEventListener('change', updateParticularSituationOptions);
  document.getElementById('revenu-net-annuel').addEventListener('input', updateRevenuabbt);
  document.getElementById('revenu-conjoint').addEventListener('input', updateRevenuabbt);
  document.getElementById('marital_status').addEventListener('change', updateRevenuabbt);
  document.getElementById('calculer_impots').addEventListener('click', calculateImpots);
  document.getElementById('childrenCount').addEventListener('change', calculateredmax);
  document.getElementById('altChildrenCount').addEventListener('change', calculateredmax);
  document.getElementById('particular_situation').addEventListener('change', calculateredmax);
  document.getElementById('revenu-net-annuel').addEventListener('change', calculateDecote);
  document.getElementById('durée').addEventListener('change', calculatemensualité);
  document.getElementById('credit').addEventListener('change', calculatemensualité);
  document.getElementById('taux_assurance').addEventListener('change', calculatemensualité);
  document.getElementById('taux').addEventListener('change', calculatemensualité);
  document.getElementById('loyer').addEventListener('change', calculateloyer);
  document.getElementById('charges').addEventListener('change', calculateloyer);
  document.getElementById('tf').addEventListener('change', calculateloyer);
  document.getElementById('pno').addEventListener('change', calculateloyer);
});


                                            // FONCTION CALCUL REVENU NET APRES ABBATEMENT // 
                                            
let revenuabbtotal = 0;                                         

function updateRevenuabbt() {

  const abbatementmax = 13522; // METTRE A JOUR CHAQUE ANNEE //
  const abbatementmin = 472;   // METTRE A JOUR CHAQUE ANNEE //

  let salaireNetAnnuel = parseFloat(document.getElementById('revenu-net-annuel').value) || 0;
  let salaireNetAnnuelConjoint = parseFloat(document.getElementById('revenu-conjoint').value) || 0;
  let maritalStatus = document.getElementById('marital_status').value;
  let conjointRevenu = document.querySelector('.conjoint-revenu');

  if (maritalStatus === 'married' || maritalStatus === 'pacsed') {
    conjointRevenu.style.display = 'block';
  } else {
    conjointRevenu.style.display = 'none';
  }
                       // Calcul du revenu avec abattement pour la personne //
  
   let revenuabbt;

  if (salaireNetAnnuel * 0.1 >= abbatementmax) {
    revenuabbt = salaireNetAnnuel - abbatementmax;
  } else if (salaireNetAnnuel * 0.1 <= abbatementmin && salaireNetAnnuel > abbatementmin) {
    revenuabbt = salaireNetAnnuel - abbatementmin;
  } else if (salaireNetAnnuel - abbatementmin <= 0) {
    revenuabbt = 0;
  } else {
    revenuabbt = salaireNetAnnuel * 0.9;
  }
                        // Calcul du revenu avec abattement pour le conjoint //
  let revenuabbtcjt;

  if (salaireNetAnnuelConjoint * 0.1 >= abbatementmax) {
    revenuabbtcjt = salaireNetAnnuelConjoint - abbatementmax;
  } else if (salaireNetAnnuelConjoint * 0.1 <= abbatementmin && salaireNetAnnuelConjoint > abbatementmin) {
    revenuabbtcjt = salaireNetAnnuelConjoint - abbatementmin;
  } else if (salaireNetAnnuelConjoint - abbatementmin <= 0) {
    revenuabbtcjt = 0;
  } else {
    revenuabbtcjt = salaireNetAnnuelConjoint * 0.9;
  }

  revenuabbtotal; 

  if (maritalStatus === 'married' || maritalStatus === 'pacsed') {
    revenuabbtotal = revenuabbtcjt + revenuabbt;
  } else {
    revenuabbtotal = revenuabbt;
  }

  document.getElementById('resulta').innerText = `Revenu net après abattement : ${revenuabbtotal} €`;
}

                                              // FONCTION CALCUL PART FISCALE //
                                        
let totalParts = 0
let noaddParts = 0 // Nombre de parts sans ajout de parts supplémentaire //                                     

function calculateTaxParts() {
  const maritalStatus = document.getElementById('marital_status').value;
  const childrenCount = parseInt(document.getElementById('childrenCount').value) || 0;
  const altChildrenCount = parseInt(document.getElementById('altChildrenCount').value) || 0;
  const particularSituation = document.getElementById('particular_situation').value;

  if (maritalStatus === 'married') {
    noaddParts = 2
  } else noaddParts = 1

  let defaultParts = 0;

                           // Calcul du nombre de part par défaut 

  if (maritalStatus === 'married' && particularSituation !== 'Nop') { 
    defaultParts = 2.5;
  } else if (maritalStatus === 'married') { 
    defaultParts = 2;
  } else if (maritalStatus === 'single' && (particularSituation === 'self' || particularSituation === 'invalid')) {
    defaultParts = 1.5;
  } else if (maritalStatus === 'single' && particularSituation === 'isoled' && childrenCount > 0) {
      defaultParts = 1.5;
  } else if (maritalStatus === 'single' && particularSituation === 'isoled' && altChildrenCount > 0 && childrenCount === 0 ) {
      defaultParts = 1 + 0.25 * Math.min(2, altChildrenCount);
  } else if (maritalStatus === 'widowed' && childrenCount+altChildrenCount > 0 && particularSituation === 'Nop') {
    defaultParts = 2;
  } else if (maritalStatus === 'widowed' && childrenCount+altChildrenCount > 0 && (particularSituation === 'invalid' || particularSituation === 'self')) {
    defaultParts = 2.5;
  } else if (maritalStatus === 'widowed' && childrenCount+altChildrenCount === 0 && (particularSituation === 'invalid' || particularSituation === 'self')) {
      defaultParts = 1.5;
  } else {
    defaultParts = 1;
  }

  let additionalParts = 0; 

                         // Calcul du nombre de parts supplémentaires

                         // Cas où pas d'enfant en garde alterné //
  if (childrenCount > 0 && altChildrenCount === 0) { 
    additionalParts += 0.5 * Math.min(2, childrenCount) + Math.max(0, childrenCount - 2);
                         // Cas où pas d'enfant à pleine charge //
  } else if (altChildrenCount > 0 && childrenCount === 0) { 
    additionalParts += 0.25 * Math.min(2, altChildrenCount) + Math.max(0, altChildrenCount - 2) * 0.5;
                         // Cas où un enfant en garde alterné et un enfant à plein charge //
  } else if (altChildrenCount === 1 && childrenCount === 1) { 
    additionalParts += 0.75;
                         // Cas où plus d'un enfant à pleine charge et un en garde alterné //
  } else if (childrenCount > 1 && altChildrenCount === 1) { 
    additionalParts += 0.5 * Math.min(2, childrenCount) + childrenCount - 2 + 0.5;
                         // Cas où plus d'un enfant en garde alterné et un en enfant à pleine charge //
  } else if (childrenCount === 1 && altChildrenCount > 1) {
    additionalParts += 0.75 + (altChildrenCount - 1) * 0.5;
                         // Cas où plus d'un enfant en garde alterné et plus d'un enfant à pleine charge //
  } else if (childrenCount > 1 && altChildrenCount > 1) {
    additionalParts += 1 + (childrenCount - 2) + altChildrenCount * 0.5;
  }
                                
  totalParts = defaultParts + additionalParts; // Nombre total de parts

  document.getElementById('result').innerText = `Nombre de parts fiscales : ${totalParts}`;

                                                           // FIN //

}
                                           // FONCTION CALCUL DECÔTE //

let decote = 0                                       

function calculateDecote() {
const maritalStatus = document.getElementById('marital_status').value;

                                          // METTRE A JOUR CHAQUE ANNEE //

                               const seuilcelib = 1840; const seuilcouple = 3045
                               const forfaitcelib = 833; const forfaitcouple = 1378
                               const decotpourcent = 0.4525

                                          // METTRE A JOUR CHAQUE ANNEE //


if (maritalStatus === "married" && impotbrut < seuilcouple) {
decote = forfaitcouple - (impotbrut * decotpourcent)
} else if (maritalStatus !== "!married" && impotbrut < seuilcelib) {
  decote = forfaitcelib - (impotbrut * decotpourcent)
} else {
  decote = 0
}

decote = Math.round(decote);

document.getElementById('décôte').innerText = `Décôte ${decote} €`;

}

                                // Calcul de la réduction d'impôts maximale dû au(x) part(s) suplémentaire

let y = 0

function calculateredmax() {
  const maritalStatus = document.getElementById('marital_status').value;
  const childrenCount = parseInt(document.getElementById('childrenCount').value) || 0;
  const altChildrenCount = parseInt(document.getElementById('altChildrenCount').value) || 0;
  const particularSituation = document.getElementById('particular_situation').value;

                                            // METTRE A JOUR CHAQUE ANNEE //

                                          const demipartenfant = 1678
                                          const isoled = 3996
                                          const selfchildren = 1002
                                          const widowed = 5273
                                          const invalid = 3383

                                            // METTRE A JOUR CHAQUE ANNEE //
  let rédumaxchildren = 0;
  let réducisoled = 0;
  let réducself = 0;
  let réducwidowed = 0;
  let réducinvalid =0;

if (altChildrenCount === 0 && childrenCount > 0) {
  
    rédumaxchildren = demipartenfant * Math.min(2, childrenCount) + demipartenfant * 2 * Math.max(0, childrenCount - 2)

} else if (childrenCount === 0 && altChildrenCount > 0) {

  rédumaxchildren = 0.5 * demipartenfant * Math.min(2, altChildrenCount) + Math.max(0, altChildrenCount - 2) * demipartenfant

} else if (childrenCount === 1 && altChildrenCount === 1) {

  rédumaxchildren = 1.5 * demipartenfant // Un demi part complète + la moitié d'une demi part //

} else if (childrenCount > 1 && altChildrenCount === 1 ) {

  rédumaxchildren = demipartenfant * Math.min(2, childrenCount) + (childrenCount - 2) * 2 * demipartenfant + demipartenfant

} else if (childrenCount === 1 && altChildrenCount > 1) {

  rédumaxchildren = 1.5 * demipartenfant + (altChildrenCount - 1) * demipartenfant

} else if (childrenCount > 1 && altChildrenCount > 1) {

  rédumaxchildren =  2 * demipartenfant + (childrenCount - 2) * 2 * demipartenfant + altChildrenCount * demipartenfant

}

if (particularSituation === 'isoled' && childrenCount > 0 && altChildrenCount === 0) {
  réducisoled = isoled - demipartenfant
} else if (particularSituation === 'isoled' && childrenCount === 0 && altChildrenCount > 0) {
  réducisoled = Math.min(2, altChildrenCount) * 0.25 * isoled
} else if (particularSituation === 'isoled' && childrenCount > 0 && altChildrenCount > 0) {
  réducisoled = isoled - demipartenfant
}
  
if (particularSituation === 'self') {
  réducself = selfchildren
} else réducself = 0

if (maritalStatus === 'widowed' && childrenCount > 0) {
  réducwidowed = widowed - demipartenfant
} else réducwidowed = 0

if (particularSituation === 'invalid') {
  réducinvalid = invalid
} else réducinvalid = 0

y = rédumaxchildren + réducisoled + réducwidowed + réducinvalid + réducself

document.getElementById('resulti').innerText = `Réduction max : ${y}`;

}

                                                  // FIN //

                                            // FONCTION CALCUL IMPÔT //

   let impotbrut = 0   
   let impotbrutal = 0 // Calcul de l'impôt sans ajout de parts supplémentaire //                                

   function calculateImpots() {

    let RFR = revenuabbtotal/totalParts
                                            // METTRE A JOUR CHAQUE ANNEE //

                                           const R1 = 11294; const T1 = 0.11
                                           const R2 = 28797; const T2 = 0.30
                                           const R3 = 82341; const T3 = 0.41
                                           const R4 = 177106; const T4 = 0.45

                                            // METTRE A JOUR CHAQUE ANNEE //

    if (RFR <= R1) {
      impotbrut = 0;
    } else if (RFR > R1 && RFR < R2) {
      impotbrut = (RFR - R1) * T1 * totalParts
    } else if (RFR >= R2 && RFR < R3) {
      impotbrut = ((R2 - R1) * T1 + (RFR - R2) * T2) * totalParts
    } else if (RFR >= R3 && RFR < R4) {
      impotbrut = ((R2 - R1) * T1 + (R3 - R2) * T2 + (RFR - R3) * T3) * totalParts
    } else if (RFR >= R4) {
      impotbrut = ((R2 - R1) * T1 + (R3 - R2) * T2 + (R4 - R3) * T3 + (RFR - R4) * T4) * totalParts
    }

    let RFR2 = revenuabbtotal/noaddParts

    if (RFR2 <= R1) {
      impotbrutal = 0;
    } else if (RFR2 > R1 && RFR2 < R2) {
      impotbrutal = (RFR2 - R1) * T1 * noaddParts
    } else if (RFR2 >= R2 && RFR2 < R3) {
      impotbrutal = ((R2 - R1) * T1 + (RFR2 - R2) * T2) * noaddParts
    } else if (RFR2 >= R3 && RFR2 < R4) {
      impotbrutal = ((R2 - R1) * T1 + (R3 - R2) * T2 + (RFR2 - R3) * T3) * noaddParts
    } else if (RFR2 >= R4) {
      impotbrutal = ((R2 - R1) * T1 + (R3 - R2) * T2 + (R4 - R3) * T3 + (RFR2 - R4) * T4) * noaddParts
    }

    calculateDecote();

    let impotnet = 0
    
    if ((impotbrutal-impotbrut) >= y ) {
      impotnet = impotbrutal - y - decote
    } else if ((impotbrutal-impotbrut) < y) {
      impotnet = impotbrut - decote
    }
    
    if (impotnet < 0) {
      impotnet = 0
    } else impotnet
    
    impotnet = Math.round(impotnet);

    
    document.getElementById('resultat_impots').innerText = `Impôt =  ${impotnet} €`;

    
  return impotnet;
  
  }


                                             // FIN //



function updateParticularSituationOptions() {
  const maritalStatus = document.getElementById("marital_status").value;
  const particularSituation = document.getElementById("particular_situation");
  const options = [
    { value: "Nop", text: "Pas de situation particulière" },
    { value: "isoled", text: "Parent isolé(e)" },
    { value: "self", text: "Élevé(e) seul un enfant pendant 5 ans" },
    { value: "invalid", text: "Invalide / Ancien combattant(e)" },
  ];

  particularSituation.innerHTML = "";

  options.forEach((option) => {
    const newOption = document.createElement("option");
    newOption.value = option.value;
    newOption.text = option.text;

    if (maritalStatus === "married" && (option.value === "isoled" || option.value === "self")) {
      return;
    }
    if (maritalStatus === "widowed" && (option.value === "isoled" || option.value === "self")) {
      return;
    }

    particularSituation.add(newOption);
  });
}


document.getElementById('calculer_impots').addEventListener('click', function(event) {
  event.preventDefault(); // Empêche le comportement par défaut du bouton
  let impotnet = calculateImpots(); // Appelle la fonction calculateImpots
  // Rediriger vers la nouvelle page avec le résultat de l'impôt
  let resultatUrl = "resultat.html?impotnet=" + impotnet;
  window.location.href = resultatUrl;
});

function calculatemensualité() {
  const n = (document.getElementById('durée').value)*12;
  const M = parseInt(document.getElementById('credit').value) || 0;
  const t = (parseFloat(document.getElementById('taux').value) || 0)/100/12;
  const a = (parseFloat(document.getElementById('taux_assurance').value) || 0)/100;

  assurance = a * M / 12 // assurance par mois //
  mensualité = Math.round ((M * t/(1-Math.pow(1+t, -n)) + assurance)*100)/100
  
  
  document.getElementById('mensualité').innerText = `mensulaité =  ${mensualité} €`;
  
}

function calculateloyer() {
  const loyer = (document.getElementById('loyer').value);
  const charge = parseInt(document.getElementById('charges').value) || 0;
  const tf = parseInt(document.getElementById('tf').value)/12 || 0;
  const pno = parseInt(document.getElementById('pno').value)/12 || 0;

  loyernet=Math.round(loyer-charge-tf-pno)
  
  document.getElementById('loyernet').innerText = `Loyer net =  ${loyernet} €`;
  
}

const inputField = document.getElementById($parameters.revenu-net-annuel);
inputField.onkeydown = function(e){    
     if(e.target.value.length === 0 && e.key === '.'){
            e.preventDefault();    
     }
}