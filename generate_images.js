const path = require('path');
const fs = require('fs');
const { createCanvas } = require('canvas');

const projects = [
  'VerifyAI',
  'EstatePerks',
  'PetPooja',
  'WeatherApp',
  'CurrencyConverter',
  'QuizApp',
  'RockPaperScissor',
  'EmployeeManagement',
];

const projects = [
  'VerifyAI',
  'EstatePerks',
  'PetPooja',
  'WeatherApp',
  'CurrencyConverter',
  'QuizApp',
  'RockPaperScissor',
  'EmployeeManagement',
];

projects.forEach(project => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Simple background color
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 200, 200);

  // Add project name text
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText(project, 10, 50);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join('c:', 'portfolio2', 'sourav-portfolio', 'src', 'assets', 'images', 'projects', `${project}.png`), buffer);
});
