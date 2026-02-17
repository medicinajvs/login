import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, deleteDoc, increment } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import CoursesGridLogoCards from './MeusCursos';

// Base da pasta de páginas institucionais (Vite: coloque em /public/pages institucional)
const withBase = (path) => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanBase + cleanPath;
};

// Base relativa (sem barra inicial) para páginas institucionais em /public
const INSTITUTIONAL_BASE = 'pages/institucional';
function ExternalRedirect({ to, newTab = false }) {
  useEffect(() => {
    const url = withBase(to);

    if (newTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(url);
    }
  }, [to, newTab]);

  return null;
}





function PublicHomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <style>{LoginCSS}</style>

      {/* Topo público */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div className="font-semibold text-slate-800">Medicina JVS</div>
          </div>

          <Link to="/entrar" className="text-sm text-blue-700 hover:underline">
            Entrar
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Plataforma de estudos e organização para medicina
        </h1>
        <p className="text-slate-600 max-w-3xl">
          Organize seus cursos, aulas, materiais e flashcards em um só lugar. Você também pode integrar sua agenda de
          estudos com o Google Calendar para planejar revisões e compromissos.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Integração com Google Calendar</h2>
            <p className="text-slate-600 text-sm">
              A integração permite que o usuário visualize e/ou crie eventos relacionados ao planejamento de estudos (por
              exemplo: sessões de revisão, simulados e metas). Você pode revogar o acesso a qualquer momento nas
              configurações da sua Conta Google.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Links institucionais</h2>
            <p className="text-slate-600 text-sm">
              Para mais detalhes sobre o app, consulte as páginas públicas abaixo:
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a
                className="text-blue-700 hover:underline"
                href={withBase(`${INSTITUTIONAL_BASE}/politicaPrivacidade.html`)}
                target="_blank"
                rel="noreferrer"
              >
                Privacidade
              </a>
              <a
                className="text-blue-700 hover:underline"
                href={withBase(`${INSTITUTIONAL_BASE}/termosUso.html`)}
                target="_blank"
                rel="noreferrer"
              >
                Termos
              </a>
              <a
                className="text-blue-700 hover:underline"
                href={withBase(`${INSTITUTIONAL_BASE}/suporte.html`)}
                target="_blank"
                rel="noreferrer"
              >
                Suporte
              </a>
              <a
                className="text-blue-700 hover:underline"
                href={withBase(`${INSTITUTIONAL_BASE}/cookies.html`)}
                target="_blank"
                rel="noreferrer"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/entrar"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700"
          >
            Acessar / Entrar
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ✅ Para estas páginas serem EXTERNAS de verdade, coloque os HTMLs em:
// public/pages/institucional/(politicaPrivacidade.html, termosUso.html, suporte.html, cookies.html)
// (Arquivos dentro de src/ NÃO são servidos diretamente por URL no Vite.)


// ============================================================================
// 0. PÁGINAS LEGAIS (HTML ACOPLADO)
//    (geradas a partir dos arquivos .html enviados)
// ============================================================================
const LEGAL_HTML = {
  privacy: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Política de Privacidade | [Nome da Empresa]</title>
    <meta name="description" content="Política de Privacidade e Proteção de Dados da [Nome da Empresa].">
    
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Configurações de Fonte (Inter) -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }

        /* Estilização da barra de rolagem */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        /* Destaque do link ativo no menu lateral */
        .nav-link.active {
            color: #2563eb;
            border-left: 3px solid #2563eb;
            background-color: #eff6ff;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-700 antialiased">

    <!-- Cabeçalho -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo / Nome da Empresa -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="#" class="text-xl font-bold text-slate-900">
                        <i class="fa-solid fa-shield-halved text-blue-600 mr-2"></i>
                        [Nome da Empresa]
                    </a>
                </div>
                
                <!-- Navegação Simples -->
                <nav class="hidden md:flex space-x-8">
                    <a href="#" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Home</a>
                    <a href="#" class="text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-blue-600">Privacidade</a>
                    <a href="#" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Termos de Uso</a>
                    <a href="#" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contato</a>
                </nav>

                <!-- Menu Mobile Button (Apenas visual para este exemplo) -->
                <div class="flex items-center md:hidden">
                    <button type="button" class="text-slate-500 hover:text-slate-700 focus:outline-none">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Cabeçalho do Documento -->
    <div class="bg-blue-900 text-white py-12">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
            <p class="text-blue-200 text-lg">Seu guia sobre como tratamos seus dados pessoais, em conformidade com a LGPD.</p>
            <p class="mt-4 text-sm text-blue-300">Última atualização: <span id="last-updated"></span></p>
        </div>
    </div>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row gap-8">
            
            <!-- Menu Lateral (Sticky) -->
            <aside class="md:w-1/4 hidden md:block">
                <nav class="sticky top-24 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                        Índice
                    </div>
                    <ul class="flex flex-col py-2">
                        <li><a href="#introducao" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">1. Introdução</a></li>
                        <li><a href="#coleta" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">2. Coleta de Dados</a></li>
                        <li><a href="#uso" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">3. Uso das Informações</a></li>
                        <li><a href="#compartilhamento" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">4. Compartilhamento</a></li>
                        <li><a href="#cookies" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">5. Cookies e Tecnologias</a></li>
                        <li><a href="#seguranca" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">6. Segurança de Dados</a></li>
                        <li><a href="#direitos" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">7. Seus Direitos (LGPD)</a></li>
                        <li><a href="#contato" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">8. Contato</a></li>
                    </ul>
                </nav>
            </aside>

            <!-- Texto do Documento -->
            <article class="md:w-3/4 bg-white p-8 rounded-lg shadow-sm border border-slate-200 leading-relaxed text-justify">
                
                <!-- Seção 1 -->
                <section id="introducao" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Introdução</h2>
                    <p class="mb-4">
                        A <strong>[Nome da Sua Empresa]</strong> ("nós", "nosso" ou "empresa"), inscrita no CNPJ sob o nº [00.000.000/0001-00], está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica de maneira clara e acessível como coletamos, usamos, armazenamos e protegemos os seus dados pessoais ao utilizar nosso site, aplicativos e serviços.
                    </p>
                    <p>
                        Ao acessar nosso site, você concorda com as práticas descritas nesta política. Este documento foi elaborado em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
                    </p>
                </section>

                <!-- Seção 2 -->
                <section id="coleta" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Coleta de Dados</h2>
                    <p class="mb-4">Coletamos informações para fornecer melhores serviços a todos os nossos usuários. As informações coletadas incluem:</p>
                    <ul class="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>Dados fornecidos por você:</strong> Nome, endereço de e-mail, telefone, CPF e endereço quando você preenche formulários, cria uma conta ou realiza uma compra.</li>
                        <li><strong>Dados de navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas, tempo gasto em cada página e dados de geolocalização aproximada.</li>
                        <li><strong>Dados de pagamento:</strong> Ao realizar transações, coletamos dados necessários para processar o pagamento, embora números de cartão de crédito sejam processados diretamente por gateways de pagamento seguros e não sejam armazenados em nossos servidores.</li>
                    </ul>
                </section>

                <!-- Seção 3 -->
                <section id="uso" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Uso das Informações</h2>
                    <p class="mb-4">Utilizamos os dados coletados para diversas finalidades, baseadas nas hipóteses legais da LGPD:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-semibold text-blue-800 mb-2">Prestação de Serviços</h3>
                            <p class="text-sm text-slate-600">Para processar pedidos, entregar produtos e gerenciar sua conta.</p>
                        </div>
                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-semibold text-blue-800 mb-2">Comunicação e Marketing</h3>
                            <p class="text-sm text-slate-600">Para enviar newsletters, promoções e atualizações sobre pedidos (você pode cancelar a qualquer momento).</p>
                        </div>
                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-semibold text-blue-800 mb-2">Melhoria e Segurança</h3>
                            <p class="text-sm text-slate-600">Para analisar tendências, administrar o site e prevenir fraudes.</p>
                        </div>
                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-semibold text-blue-800 mb-2">Obrigação Legal</h3>
                            <p class="text-sm text-slate-600">Para cumprir obrigações legais e regulatórias (ex: emissão de notas fiscais).</p>
                        </div>
                    </div>
                </section>

                <!-- Seção 4 -->
                <section id="compartilhamento" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">4. Compartilhamento de Dados</h2>
                    <p class="mb-4">Não vendemos seus dados pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:</p>
                    <ul class="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>Fornecedores e Parceiros:</strong> Empresas que prestam serviços em nosso nome (ex: transportadoras para entrega, processadores de pagamento, hospedagem de site).</li>
                        <li><strong>Autoridades Legais:</strong> Quando exigido por lei, ordem judicial ou autoridade governamental competente.</li>
                    </ul>
                </section>

                <!-- Seção 5 -->
                <section id="cookies" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Cookies e Tecnologias de Rastreamento</h2>
                    <p class="mb-4">Utilizamos cookies para melhorar a experiência de navegação. Um cookie é um pequeno arquivo de texto armazenado no seu dispositivo.</p>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white border border-slate-200 mt-4 text-sm">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th class="py-2 px-4 border-b text-left">Tipo de Cookie</th>
                                    <th class="py-2 px-4 border-b text-left">Finalidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="py-2 px-4 border-b font-medium">Essenciais</td>
                                    <td class="py-2 px-4 border-b">Necessários para o site funcionar (ex: login, carrinho de compras).</td>
                                </tr>
                                <tr>
                                    <td class="py-2 px-4 border-b font-medium">Analíticos</td>
                                    <td class="py-2 px-4 border-b">Coletam dados anônimos sobre como os visitantes usam o site (ex: Google Analytics).</td>
                                </tr>
                                <tr>
                                    <td class="py-2 px-4 border-b font-medium">Marketing</td>
                                    <td class="py-2 px-4 border-b">Rastreiam a navegação para exibir anúncios relevantes.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p class="mt-4 text-sm text-slate-500">Você pode gerenciar ou desabilitar os cookies nas configurações do seu navegador.</p>
                </section>

                <!-- Seção 6 -->
                <section id="seguranca" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Segurança de Dados</h2>
                    <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <i class="fa-solid fa-lock text-green-600"></i>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-green-700">
                                    Utilizamos criptografia SSL (Secure Socket Layer) para proteger a transmissão de dados e adotamos práticas rigorosas de segurança da informação.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p>
                        Apesar de adotarmos as melhores práticas, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro. Comprometemo-nos a notificar você e as autoridades competentes em caso de qualquer violação de segurança que possa acarretar risco relevante.
                    </p>
                </section>

                <!-- Seção 7 -->
                <section id="direitos" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">7. Seus Direitos (LGPD)</h2>
                    <p class="mb-4">De acordo com a Lei Geral de Proteção de Dados, você tem o direito de:</p>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-blue-500 mt-1 mr-2"></i>
                            <span>Confirmar a existência de tratamento de dados.</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-blue-500 mt-1 mr-2"></i>
                            <span>Acessar os dados que possuímos sobre você.</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-blue-500 mt-1 mr-2"></i>
                            <span>Corrigir dados incompletos, inexatos ou desatualizados.</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-blue-500 mt-1 mr-2"></i>
                            <span>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fa-solid fa-check text-blue-500 mt-1 mr-2"></i>
                            <span>Revogar o consentimento a qualquer momento.</span>
                        </li>
                    </ul>
                </section>

                <!-- Seção 8 -->
                <section id="contato" class="scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">8. Contato e Encarregado de Dados (DPO)</h2>
                    <p class="mb-6">
                        Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus direitos, entre em contato conosco através do nosso Encarregado de Proteção de Dados:
                    </p>
                    
                    <div class="bg-blue-50 rounded-lg p-6 border border-blue-100 text-center md:text-left">
                        <h3 class="text-lg font-bold text-blue-900 mb-2">[Nome da Sua Empresa]</h3>
                        <p class="text-blue-800 mb-1"><i class="fa-solid fa-envelope mr-2"></i> <strong>E-mail:</strong> <a href="mailto:privacidade@suaempresa.com" class="underline">privacidade@suaempresa.com</a></p>
                        <p class="text-blue-800 mb-1"><i class="fa-solid fa-phone mr-2"></i> <strong>Telefone:</strong> (00) 0000-0000</p>
                        <p class="text-blue-800"><i class="fa-solid fa-location-dot mr-2"></i> <strong>Endereço:</strong> Rua Exemplo, 123 - Cidade/UF</p>
                    </div>
                </section>

            </article>
        </div>
    </main>

    <!-- Rodapé -->
    <footer class="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">[Nome da Empresa]</h3>
                    <p class="text-sm text-slate-400">Comprometidos com a qualidade e a segurança dos seus dados.</p>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Links Rápidos</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="hover:text-white transition-colors">Início</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Termos de Uso</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Política de Cookies</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Legal</h3>
                    <p class="text-sm text-slate-400">CNPJ: 00.000.000/0001-00</p>
                    <p class="text-sm text-slate-400 mt-2">&copy; <span id="current-year"></span> Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Botão Voltar ao Topo -->
    <button id="backToTop" class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-0 invisible z-50" title="Voltar ao topo">
        <i class="fa-solid fa-arrow-up"></i>
    </button>

    <!-- Scripts -->
    <script>
        // 1. Atualizar Ano e Data
        const today = new Date();
        document.getElementById('current-year').textContent = today.getFullYear();
        
        // Formata a data para Português
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('last-updated').textContent = today.toLocaleDateString('pt-BR', options);

        // 2. Comportamento do Menu Lateral (Active State on Scroll)
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                // Offset de 150px para compensar o header fixo
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('active');
                }
            });
        });

        // 3. Botão Voltar ao Topo
        const backToTopButton = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    </script>
</body>
</html>`,
  terms: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Termos de Uso | [Nome da Empresa]</title>
    <meta name="description" content="Termos de Uso e Condições Gerais da [Nome da Empresa].">
    
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Configurações de Fonte (Inter) -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }

        /* Estilização da barra de rolagem */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        /* Destaque do link ativo no menu lateral */
        .nav-link.active {
            color: #2563eb;
            border-left: 3px solid #2563eb;
            background-color: #eff6ff;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-700 antialiased">

    <!-- Cabeçalho -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo / Nome da Empresa -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="#" class="text-xl font-bold text-slate-900">
                        <i class="fa-solid fa-file-contract text-blue-600 mr-2"></i>
                        [Nome da Empresa]
                    </a>
                </div>
                
                <!-- Navegação Simples -->
                <nav class="hidden md:flex space-x-8">
                    <a href="index.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Home</a>
                    <a href="politica_privacidade.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Privacidade</a>
                    <a href="#" class="text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-blue-600">Termos de Uso</a>
                    <a href="#" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contato</a>
                </nav>

                <!-- Menu Mobile Button -->
                <div class="flex items-center md:hidden">
                    <button type="button" class="text-slate-500 hover:text-slate-700 focus:outline-none">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Cabeçalho do Documento -->
    <div class="bg-slate-800 text-white py-12">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Termos de Uso</h1>
            <p class="text-slate-300 text-lg">Regras e condições para a utilização dos nossos serviços.</p>
            <p class="mt-4 text-sm text-slate-400">Última atualização: <span id="last-updated"></span></p>
        </div>
    </div>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row gap-8">
            
            <!-- Menu Lateral (Sticky) -->
            <aside class="md:w-1/4 hidden md:block">
                <nav class="sticky top-24 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                        Índice
                    </div>
                    <ul class="flex flex-col py-2">
                        <li><a href="#aceitacao" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">1. Aceitação</a></li>
                        <li><a href="#acesso" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">2. Acesso e Cadastro</a></li>
                        <li><a href="#obrigacoes" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">3. Obrigações</a></li>
                        <li><a href="#propriedade" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">4. Propriedade Intelectual</a></li>
                        <li><a href="#privacidade" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">5. Privacidade</a></li>
                        <li><a href="#isencao" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">6. Isenção de Garantias</a></li>
                        <li><a href="#alteracoes" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">7. Alterações</a></li>
                        <li><a href="#foro" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">8. Foro</a></li>
                    </ul>
                </nav>
            </aside>

            <!-- Texto do Documento -->
            <article class="md:w-3/4 bg-white p-8 rounded-lg shadow-sm border border-slate-200 leading-relaxed text-justify">
                
                <!-- Seção 1 -->
                <section id="aceitacao" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Aceitação dos Termos</h2>
                    <p class="mb-4">
                        Bem-vindo à <strong>[Nome da Sua Empresa]</strong>. Ao acessar e utilizar nosso site, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. 
                    </p>
                    <p>
                        Se você não concordar com qualquer parte destes termos, você não deve acessar ou utilizar nossos serviços. Estes Termos aplicam-se a todos os visitantes, usuários e outras pessoas que acessam ou usam o Serviço.
                    </p>
                </section>

                <!-- Seção 2 -->
                <section id="acesso" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Acesso e Cadastro</h2>
                    <p class="mb-4">Para acessar certos recursos do site, pode ser necessário que você forneça certas informações para criar uma conta ("Cadastro").</p>
                    <ul class="list-disc pl-6 mb-4 space-y-2">
                        <li>Você garante que as informações fornecidas são verdadeiras, precisas e completas.</li>
                        <li>Você é responsável por manter a confidencialidade de sua senha e conta.</li>
                        <li>Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.</li>
                    </ul>
                </section>

                <!-- Seção 3 -->
                <section id="obrigacoes" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Obrigações do Usuário</h2>
                    <p class="mb-4">Ao utilizar nosso serviço, você concorda em não:</p>
                    <div class="bg-red-50 p-4 rounded border border-red-100 text-red-800 text-sm">
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Violar qualquer lei ou regulamento aplicável.</li>
                            <li>Tentar interferir ou comprometer a integridade ou segurança do sistema.</li>
                            <li>Enviar publicidade não solicitada (SPAM).</li>
                            <li>Coletar dados de outros usuários sem consentimento.</li>
                        </ul>
                    </div>
                </section>

                <!-- Seção 4 -->
                <section id="propriedade" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">4. Propriedade Intelectual</h2>
                    <p class="mb-4">
                        O Serviço e seu conteúdo original (excluindo Conteúdo fornecido por usuários), recursos e funcionalidades são e permanecerão de propriedade exclusiva da <strong>[Nome da Sua Empresa]</strong> e seus licenciadores.
                    </p>
                    <p>
                        O Serviço é protegido por direitos autorais, marcas registradas e outras leis do Brasil e de outros países. Nossas marcas registradas não podem ser usadas em conexão com qualquer produto ou serviço sem o consentimento prévio por escrito.
                    </p>
                </section>

                <!-- Seção 5 -->
                <section id="privacidade" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Privacidade</h2>
                    <p>
                        A sua privacidade é importante para nós. A utilização dos nossos serviços também é regida pela nossa <a href="politica_privacidade.html" class="text-blue-600 hover:underline font-semibold">Política de Privacidade</a>, que descreve como coletamos, usamos e compartilhamos suas informações.
                    </p>
                </section>

                <!-- Seção 6 -->
                <section id="isencao" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Limitação de Responsabilidade</h2>
                    <p class="mb-4">
                        Em nenhum caso a <strong>[Nome da Sua Empresa]</strong>, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.
                    </p>
                    <p class="text-sm text-slate-500 italic">
                        O serviço é fornecido "no estado em que se encontra" e "conforme disponível", sem garantias de qualquer tipo.
                    </p>
                </section>

                <!-- Seção 7 -->
                <section id="alteracoes" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">7. Alterações nos Termos</h2>
                    <p>
                        Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma mudança material será determinado a nosso exclusivo critério.
                    </p>
                </section>

                <!-- Seção 8 -->
                <section id="foro" class="scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">8. Legislação e Foro</h2>
                    <p>
                        Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem levar em conta o conflito de provisões legais.
                    </p>
                    <p class="mt-2">
                        Fica eleito o foro da comarca de <strong>[Sua Cidade/UF]</strong> para dirimir quaisquer dúvidas ou litígios oriundos deste termo, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
                    </p>
                </section>

            </article>
        </div>
    </main>

    <!-- Rodapé -->
    <footer class="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">[Nome da Empresa]</h3>
                    <p class="text-sm text-slate-400">Excelência em serviços digitais.</p>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Links Rápidos</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="politica_privacidade.html" class="hover:text-white transition-colors">Política de Privacidade</a></li>
                        <li><a href="#" class="hover:text-white transition-colors text-white font-semibold">Termos de Uso</a></li>
                        <li><a href="politica_cookies.html" class="hover:text-white transition-colors">Política de Cookies</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Legal</h3>
                    <p class="text-sm text-slate-400">CNPJ: 00.000.000/0001-00</p>
                    <p class="text-sm text-slate-400 mt-2">&copy; <span id="current-year"></span> Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Botão Voltar ao Topo -->
    <button id="backToTop" class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-0 invisible z-50" title="Voltar ao topo">
        <i class="fa-solid fa-arrow-up"></i>
    </button>

    <!-- Scripts -->
    <script>
        // 1. Atualizar Ano e Data
        const today = new Date();
        document.getElementById('current-year').textContent = today.getFullYear();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('last-updated').textContent = today.toLocaleDateString('pt-BR', options);

        // 2. Comportamento do Menu Lateral
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('active');
                }
            });
        });

        // 3. Botão Voltar ao Topo
        const backToTopButton = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    </script>
</body>
</html>`,
  support: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Central de Suporte | [Nome da Empresa]</title>
    <meta name="description" content="Central de Ajuda e Suporte da [Nome da Empresa]. Tire suas dúvidas ou entre em contato.">
    
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Configurações de Fonte (Inter) -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }

        /* Estilização da barra de rolagem */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        /* Destaque do link ativo no menu lateral */
        .nav-link.active {
            color: #2563eb;
            border-left: 3px solid #2563eb;
            background-color: #eff6ff;
            font-weight: 600;
        }

        /* Estilo para inputs do formulário */
        .form-input {
            transition: all 0.3s ease;
        }
        .form-input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            outline: none;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-700 antialiased">

    <!-- Cabeçalho -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo / Nome da Empresa -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="#" class="text-xl font-bold text-slate-900">
                        <i class="fa-solid fa-headset text-blue-600 mr-2"></i>
                        [Nome da Empresa]
                    </a>
                </div>
                
                <!-- Navegação Simples -->
                <nav class="hidden md:flex space-x-8">
                    <a href="index.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Home</a>
                    <a href="politica_privacidade.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Privacidade</a>
                    <a href="termos_uso.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Termos de Uso</a>
                    <a href="#" class="text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-blue-600">Suporte</a>
                </nav>

                <!-- Menu Mobile Button -->
                <div class="flex items-center md:hidden">
                    <button type="button" class="text-slate-500 hover:text-slate-700 focus:outline-none">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Cabeçalho do Documento (Hero) -->
    <div class="bg-blue-900 text-white py-12">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Como podemos ajudar?</h1>
            <p class="text-blue-200 text-lg">Central de Atendimento e Suporte Técnico.</p>
            
            <!-- Barra de busca simulada -->
            <div class="max-w-lg mx-auto mt-8 relative">
                <input type="text" placeholder="Busque por dúvidas (ex: redefinir senha)" class="w-full py-3 px-4 pl-12 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
            </div>
        </div>
    </div>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row gap-8">
            
            <!-- Menu Lateral (Sticky) -->
            <aside class="md:w-1/4 hidden md:block">
                <nav class="sticky top-24 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                        Navegação
                    </div>
                    <ul class="flex flex-col py-2">
                        <li><a href="#faq" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">1. Perguntas Frequentes</a></li>
                        <li><a href="#canais" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">2. Canais de Atendimento</a></li>
                        <li><a href="#horarios" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">3. Horários</a></li>
                        <li><a href="#formulario" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">4. Abrir Chamado</a></li>
                        <li><a href="#feedback" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">5. Ouvidoria</a></li>
                    </ul>
                </nav>
            </aside>

            <!-- Conteúdo -->
            <article class="md:w-3/4 space-y-8">
                
                <!-- Seção 1: FAQ -->
                <section id="faq" class="bg-white p-8 rounded-lg shadow-sm border border-slate-200 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">1. Perguntas Frequentes (FAQ)</h2>
                    
                    <div class="space-y-4">
                        <!-- Pergunta 1 -->
                        <div class="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <h3 class="font-semibold text-blue-800 mb-2 flex items-center">
                                <i class="fa-solid fa-circle-question mr-2 text-blue-500"></i>
                                Como faço para redefinir minha senha?
                            </h3>
                            <p class="text-sm text-slate-600 ml-6">
                                Acesse a página de login e clique em "Esqueci minha senha". Enviaremos um link de redefinição para o seu e-mail cadastrado.
                            </p>
                        </div>

                        <!-- Pergunta 2 -->
                        <div class="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <h3 class="font-semibold text-blue-800 mb-2 flex items-center">
                                <i class="fa-solid fa-circle-question mr-2 text-blue-500"></i>
                                Quais as formas de pagamento aceitas?
                            </h3>
                            <p class="text-sm text-slate-600 ml-6">
                                Aceitamos cartões de crédito (Visa, Mastercard, Elo), boleto bancário e PIX com aprovação imediata.
                            </p>
                        </div>

                        <!-- Pergunta 3 -->
                        <div class="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <h3 class="font-semibold text-blue-800 mb-2 flex items-center">
                                <i class="fa-solid fa-circle-question mr-2 text-blue-500"></i>
                                Como solicito um reembolso?
                            </h3>
                            <p class="text-sm text-slate-600 ml-6">
                                O reembolso pode ser solicitado em até 7 dias após a compra. Entre em contato pelo formulário abaixo ou pelo nosso chat.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Seção 2: Canais -->
                <section id="canais" class="bg-white p-8 rounded-lg shadow-sm border border-slate-200 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">2. Canais de Atendimento</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Card E-mail -->
                        <div class="p-6 bg-blue-50 rounded-lg text-center border border-blue-100">
                            <div class="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-800">
                                <i class="fa-solid fa-envelope text-xl"></i>
                            </div>
                            <h3 class="font-bold text-slate-800">E-mail</h3>
                            <p class="text-sm text-slate-600 mb-4">Para dúvidas gerais e orçamentos.</p>
                            <a href="mailto:suporte@suaempresa.com" class="text-blue-600 font-semibold hover:underline">suporte@suaempresa.com</a>
                        </div>

                        <!-- Card WhatsApp -->
                        <div class="p-6 bg-green-50 rounded-lg text-center border border-green-100">
                            <div class="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4 text-green-800">
                                <i class="fa-brands fa-whatsapp text-xl"></i>
                            </div>
                            <h3 class="font-bold text-slate-800">WhatsApp</h3>
                            <p class="text-sm text-slate-600 mb-4">Atendimento rápido e ágil.</p>
                            <a href="#" class="text-green-600 font-semibold hover:underline">(00) 90000-0000</a>
                        </div>
                    </div>
                </section>

                <!-- Seção 3: Horários -->
                <section id="horarios" class="bg-white p-8 rounded-lg shadow-sm border border-slate-200 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Horários de Atendimento</h2>
                    <p class="mb-4">Nossa equipe está disponível para ajudar nos seguintes horários:</p>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm text-left text-slate-600">
                            <thead class="bg-slate-50 text-slate-800 font-semibold">
                                <tr>
                                    <th class="px-6 py-3">Dia da Semana</th>
                                    <th class="px-6 py-3">Horário</th>
                                    <th class="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 border border-slate-100">
                                <tr>
                                    <td class="px-6 py-4 font-medium">Segunda a Sexta</td>
                                    <td class="px-6 py-4">08:00 às 18:00</td>
                                    <td class="px-6 py-4"><span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Aberto</span></td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 font-medium">Sábado</td>
                                    <td class="px-6 py-4">09:00 às 13:00</td>
                                    <td class="px-6 py-4"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Plantão</span></td>
                                </tr>
                                <tr>
                                    <td class="px-6 py-4 font-medium">Domingo e Feriados</td>
                                    <td class="px-6 py-4">-</td>
                                    <td class="px-6 py-4"><span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Fechado</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <!-- Seção 4: Formulário -->
                <section id="formulario" class="bg-white p-8 rounded-lg shadow-sm border border-slate-200 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">4. Abrir Chamado</h2>
                    <p class="mb-6 text-slate-600">Preencha o formulário abaixo e entraremos em contato o mais breve possível.</p>
                    
                    <form action="#" method="POST" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="nome" class="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                                <input type="text" id="nome" name="nome" class="form-input w-full border-slate-300 rounded-md shadow-sm p-2 border" placeholder="Seu nome" required>
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                                <input type="email" id="email" name="email" class="form-input w-full border-slate-300 rounded-md shadow-sm p-2 border" placeholder="seu@email.com" required>
                            </div>
                        </div>

                        <div>
                            <label for="assunto" class="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
                            <select id="assunto" name="assunto" class="form-input w-full border-slate-300 rounded-md shadow-sm p-2 border">
                                <option>Selecione um assunto...</option>
                                <option>Suporte Técnico</option>
                                <option>Financeiro / Cobrança</option>
                                <option>Vendas</option>
                                <option>Outros</option>
                            </select>
                        </div>

                        <div>
                            <label for="mensagem" class="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
                            <textarea id="mensagem" name="mensagem" rows="4" class="form-input w-full border-slate-300 rounded-md shadow-sm p-2 border" placeholder="Descreva seu problema ou dúvida..." required></textarea>
                        </div>

                        <div class="pt-2">
                            <button type="submit" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">
                                <i class="fa-solid fa-paper-plane mr-2"></i> Enviar Mensagem
                            </button>
                        </div>
                    </form>
                </section>

                <!-- Seção 5: Feedback -->
                <section id="feedback" class="bg-slate-50 p-8 rounded-lg border border-slate-200 scroll-mt-24 text-center">
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Ouvidoria</h2>
                    <p class="text-sm text-slate-600 mb-4">Seu problema não foi resolvido pelos canais tradicionais?</p>
                    <a href="mailto:ouvidoria@suaempresa.com" class="inline-block border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium py-2 px-4 rounded transition-colors">
                        Contatar Ouvidoria
                    </a>
                </section>

            </article>
        </div>
    </main>

    <!-- Rodapé -->
    <footer class="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">[Nome da Empresa]</h3>
                    <p class="text-sm text-slate-400">Sua satisfação é nossa prioridade.</p>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Links Úteis</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="politica_privacidade.html" class="hover:text-white transition-colors">Política de Privacidade</a></li>
                        <li><a href="termos_uso.html" class="hover:text-white transition-colors">Termos de Uso</a></li>
                        <li><a href="politica_cookies.html" class="hover:text-white transition-colors">Política de Cookies</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Contato</h3>
                    <p class="text-sm text-slate-400 mb-2"><i class="fa-solid fa-envelope mr-2"></i> suporte@suaempresa.com</p>
                    <p class="text-sm text-slate-400"><i class="fa-solid fa-phone mr-2"></i> (00) 0000-0000</p>
                    <p class="text-sm text-slate-400 mt-4">&copy; <span id="current-year"></span> Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Botão Voltar ao Topo -->
    <button id="backToTop" class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-0 invisible z-50" title="Voltar ao topo">
        <i class="fa-solid fa-arrow-up"></i>
    </button>

    <!-- Scripts -->
    <script>
        // 1. Atualizar Ano
        const today = new Date();
        document.getElementById('current-year').textContent = today.getFullYear();
        
        // 2. Comportamento do Menu Lateral
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                // Offset ajustado
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current) && current !== '') {
                    link.classList.add('active');
                }
            });
        });

        // 3. Botão Voltar ao Topo
        const backToTopButton = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    </script>
</body>
</html>`,
  cookies: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Política de Cookies | [Nome da Empresa]</title>
    <meta name="description" content="Política de Cookies da [Nome da Empresa]. Saiba como utilizamos cookies.">
    
    <!-- Tailwind CSS (via CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome para ícones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Configurações de Fonte (Inter) -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        .nav-link.active {
            color: #2563eb;
            border-left: 3px solid #2563eb;
            background-color: #eff6ff;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-700 antialiased">

    <!-- Cabeçalho -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="#" class="text-xl font-bold text-slate-900">
                        <i class="fa-solid fa-cookie-bite text-blue-600 mr-2"></i>
                        [Nome da Empresa]
                    </a>
                </div>
                
                <!-- Navegação -->
                <nav class="hidden md:flex space-x-8">
                    <a href="index.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Home</a>
                    <a href="politica_privacidade.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Privacidade</a>
                    <a href="termos_uso.html" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Termos de Uso</a>
                    <a href="#" class="text-slate-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contato</a>
                </nav>

                <!-- Mobile Button -->
                <div class="flex items-center md:hidden">
                    <button type="button" class="text-slate-500 hover:text-slate-700 focus:outline-none">
                        <i class="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <div class="bg-slate-800 text-white py-12">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-4">Política de Cookies</h1>
            <p class="text-slate-300 text-lg">Entenda o que são cookies e como você pode controlá-los.</p>
            <p class="mt-4 text-sm text-slate-400">Última atualização: <span id="last-updated"></span></p>
        </div>
    </div>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex flex-col md:flex-row gap-8">
            
            <!-- Menu Lateral -->
            <aside class="md:w-1/4 hidden md:block">
                <nav class="sticky top-24 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                        Navegação
                    </div>
                    <ul class="flex flex-col py-2">
                        <li><a href="#o-que-sao" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">1. O que são Cookies?</a></li>
                        <li><a href="#como-usamos" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">2. Como Usamos</a></li>
                        <li><a href="#tipos" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">3. Tipos de Cookies</a></li>
                        <li><a href="#gerenciamento" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">4. Gerenciamento</a></li>
                        <li><a href="#alteracoes" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">5. Alterações</a></li>
                        <li><a href="#contato" class="nav-link block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 border-l-3 border-transparent">6. Contato</a></li>
                    </ul>
                </nav>
            </aside>

            <!-- Artigo -->
            <article class="md:w-3/4 bg-white p-8 rounded-lg shadow-sm border border-slate-200 leading-relaxed text-justify">
                
                <section id="o-que-sao" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. O que são Cookies?</h2>
                    <p class="mb-4">
                        Cookies são pequenos arquivos de texto que são baixados no seu computador, celular ou qualquer outro dispositivo quando você visita um site. Eles permitem que o site reconheça o seu dispositivo e armazene algumas informações sobre as suas preferências ou ações passadas.
                    </p>
                    <p>
                        Os cookies não podem ser usados para executar programas ou enviar vírus para o seu computador.
                    </p>
                </section>

                <section id="como-usamos" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Como Usamos os Cookies</h2>
                    <p class="mb-4">Utilizamos cookies por vários motivos, tais como:</p>
                    <ul class="list-disc pl-6 space-y-2">
                        <li>Para permitir o funcionamento correto do nosso site.</li>
                        <li>Para melhorar a sua experiência de navegação (lembrando suas preferências).</li>
                        <li>Para entender como os usuários utilizam o nosso site (análise de tráfego).</li>
                        <li>Para fins de marketing e publicidade personalizada.</li>
                    </ul>
                </section>

                <section id="tipos" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Tipos de Cookies que Utilizamos</h2>
                    
                    <div class="space-y-6">
                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-bold text-blue-900 mb-2">Cookies Estritamente Necessários</h3>
                            <p class="text-sm">Esses cookies são essenciais para que você possa navegar pelo site e usar seus recursos, como acessar áreas seguras. Sem esses cookies, os serviços que você solicitou não podem ser fornecidos.</p>
                        </div>

                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-bold text-blue-900 mb-2">Cookies de Desempenho</h3>
                            <p class="text-sm">Esses cookies coletam informações sobre como os visitantes usam um site, por exemplo, quais páginas os visitantes acessam com mais frequência. Toda informação que esses cookies coletam é agregada e, portanto, anônima.</p>
                        </div>

                        <div class="bg-slate-50 p-4 rounded border border-slate-100">
                            <h3 class="font-bold text-blue-900 mb-2">Cookies de Funcionalidade</h3>
                            <p class="text-sm">Permitem que o site se lembre das escolhas que você faz (como seu nome de usuário, idioma ou região) e forneça recursos aprimorados e mais pessoais.</p>
                        </div>
                    </div>
                </section>

                <section id="gerenciamento" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">4. Gerenciamento de Cookies</h2>
                    <p class="mb-4">
                        Você tem o direito de decidir se aceita ou rejeita cookies. Você pode definir ou alterar os controles do seu navegador da Web para aceitar ou recusar cookies.
                    </p>
                    <p class="mb-4">Veja como gerenciar cookies nos navegadores mais populares:</p>
                    <div class="flex flex-wrap gap-3">
                        <a href="https://support.google.com/chrome/answer/95647" target="_blank" class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">Google Chrome</a>
                        <a href="https://support.mozilla.org/pt-BR/kb/ative-e-desative-os-cookies-que-os-sites-usam" target="_blank" class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">Mozilla Firefox</a>
                        <a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">Apple Safari</a>
                        <a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">Microsoft Edge</a>
                    </div>
                </section>

                <section id="alteracoes" class="mb-10 scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Alterações nesta Política</h2>
                    <p>
                        Podemos atualizar esta Política de Cookies periodicamente para refletir, por exemplo, alterações nos cookies que usamos ou por outras razões operacionais, legais ou regulamentares. Por favor, visite esta Política de Cookies regularmente para se manter informado.
                    </p>
                </section>

                <section id="contato" class="scroll-mt-24">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Contato</h2>
                    <p>Se você tiver alguma dúvida sobre nosso uso de cookies ou outras tecnologias, envie um e-mail para:</p>
                    <p class="mt-2 font-semibold text-blue-600">privacidade@suaempresa.com</p>
                </section>

            </article>
        </div>
    </main>

    <!-- Rodapé -->
    <footer class="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">[Nome da Empresa]</h3>
                    <p class="text-sm text-slate-400">Transparência e respeito com seus dados.</p>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Links Rápidos</h3>
                    <ul class="space-y-2 text-sm">
                        <li><a href="politica_privacidade.html" class="hover:text-white transition-colors">Política de Privacidade</a></li>
                        <li><a href="termos_uso.html" class="hover:text-white transition-colors">Termos de Uso</a></li>
                        <li><a href="#" class="hover:text-white transition-colors text-white font-semibold">Política de Cookies</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white text-lg font-bold mb-4">Legal</h3>
                    <p class="text-sm text-slate-400">CNPJ: 00.000.000/0001-00</p>
                    <p class="text-sm text-slate-400 mt-2">&copy; <span id="current-year"></span> Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Botão Voltar ao Topo -->
    <button id="backToTop" class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all opacity-0 invisible z-50" title="Voltar ao topo">
        <i class="fa-solid fa-arrow-up"></i>
    </button>

    <script>
        const today = new Date();
        document.getElementById('current-year').textContent = today.getFullYear();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('last-updated').textContent = today.toLocaleDateString('pt-BR', options);

        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) current = section.getAttribute('id');
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current) && current !== '') link.classList.add('active');
            });
        });

        const backToTopButton = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopButton.classList.remove('opacity-0', 'invisible');
            else backToTopButton.classList.add('opacity-0', 'invisible');
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    </script>
</body>
</html>`,
};


// ============================================================================
// 1. ESTILOS GERAIS E COMPONENTES
// ============================================================================
const LoginCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  body.login-mode {
      margin: 0;
      padding: 0;
      height: 100vh;
      width: 100vw;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #f8fafc;
      overflow: hidden;
  }

  /* Garante que o template do Vite não limite largura no Login */
  body.login-mode #root {
      width: 100%;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
  }

  .bg-grid-pattern {
      background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
      background-size: 24px 24px;
  }

  @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    
  .text-medical-600 { color: #0d9488; }
  .text-medical-500 { color: #14b8a6; }
  .bg-medical-600 { background-color: #0d9488; }
  .bg-medical-500 { background-color: #14b8a6; }
  .border-medical-500 { border-color: #14b8a6; }
  .hover\:bg-medical-700:hover { background-color: #0f766e; }
  .focus\:ring-medical-500\/20:focus { --tw-ring-color: rgb(20 184 166 / 0.2); }
`;


// CSS base para garantir layout full-width/full-height (evita 'app espremido' do template Vite)
const BaseCSS = `
  html, body, #root { height: 100%; width: 100%; }
  #root { max-width: none !important; margin: 0 !important; padding: 0 !important; }
  html body { background: #f8fafc !important; }
  /* ==== FORÇA FUNDO CLARO EM TUDO (mata o "preto atrás") ==== */
html, body, #root {
  width: 100%;
  min-height: 100%;
  background: #f8fafc !important; /* mesmo fundo do site */
}

/* Evita qualquer "transparência" em wrappers */
.main-layout-wrapper,
#app-shell,
.app-shell,
.dashboard-shell,
main {
  background: #f8fafc !important;
}

`;

const ComingSoonCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

  @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }

  .coming-soon-fixed {
      position: fixed;
      top: 0; 
      right: 0;
      bottom: 0; 
      z-index: 40; 
      background-color: #f8fafc; 
      width: calc(100% - 6.5rem); 
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
  }

  body.sidebar-expanded .coming-soon-fixed {
      width: calc(100% - 16rem);
  }
`;

const DashboardCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  body.dashboard-mode {
      font-family: 'Inter', sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
  }

  /* Garante que o template do Vite não limite largura no Dashboard */
  body.dashboard-mode #root {
      width: 100%;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
  }


  /* SIDEBAR DINÂMICA */
  #sidebar {
      position: fixed; 
      top: 0; 
      left: 0; 
      z-index: 60;
      width: 6.5rem;
      height: 100vh;
      background-color: white;
      border-right: 1px solid #e2e8f0;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
  }
    
  body.sidebar-expanded #sidebar { 
      width: 16rem; 
  }

  /* LAYOUT WRAPPER */
  .main-layout-wrapper {
      position: relative;
      margin-left: 6.5rem;
      width: calc(100% - 6.5rem);
      min-height: 100vh;
      background-color: #f8fafc;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body.sidebar-expanded .main-layout-wrapper { 
      margin-left: 16rem; 
      width: calc(100% - 16rem);
  }

  .dashboard-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 50;
      background-color: white;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      width: calc(100% - 6.5rem); 
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body.sidebar-expanded .dashboard-header {
      width: calc(100% - 16rem);
  }

  #sidebar .sidebar-link-text, #sidebar .logo-text {
      opacity: 0; transform: translateX(-10px);
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      pointer-events: none; white-space: nowrap; width: 0; overflow: hidden;
  }
  body.sidebar-expanded #sidebar .sidebar-link-text, body.sidebar-expanded #sidebar .logo-text {
      opacity: 1; transform: translateX(0); pointer-events: auto; width: auto;
  }
    
  .sidebar-link {
      display: flex; align-items: center; padding: 0.75rem; width: 100%;
      border-radius: 0.75rem; justify-content: center;
      color: #64748b;
      text-decoration: none;
  }
  body.sidebar-expanded .sidebar-link { justify-content: flex-start; }
    
  .sidebar-link .icon-container {
      display: flex; align-items: center; justify-content: center;
      min-width: 2.5rem; min-height: 2.5rem; border-radius: 0.5rem;
      transition: background-color 0.2s ease, color 0.2s ease;
  }
  .sidebar-link svg { stroke: currentColor; fill: none; transition: all 0.2s ease; }
    
  .sidebar-link.active .icon-container { background-color: #0d9488; color: white; }
  .sidebar-link.active svg { stroke: white; }
  body.sidebar-expanded .sidebar-link.active { background-color: #0d9488; color: white; }
  body.sidebar-expanded .sidebar-link.active .icon-container { background-color: transparent; }
    
  .sidebar-link:hover .icon-container { background-color: #ccfbf1; color: #0f766e; }
  .sidebar-link:hover svg { stroke: currentColor; }
  body.sidebar-expanded .sidebar-link:hover { background-color: #ccfbf1; color: #0f766e; }
  body.sidebar-expanded .sidebar-link:hover .icon-container { background-color: transparent; }
    
  .sidebar-scrollable { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
  .sidebar-scrollable::-webkit-scrollbar { width: 6px; }
  .sidebar-scrollable::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scrollable::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

  /* Elementos de UI do Dashboard */
  .filter-input {
      appearance: none; -webkit-appearance: none; background-color: white;
      border: 1px solid transparent;
      border-radius: 0.5rem; padding: 0.625rem 1rem;
      font-size: 0.875rem; color: #475569; 
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      transition: all 0.2s ease;
  }
  .filter-input:hover { background-color: #f8fafc; } 
  .filter-input:focus { outline: none; box-shadow: 0 0 0 2px rgb(59 130 246 / 0.1); background-color: white; }
    
  .view-toggle-button {
      background-color: white; border: 1px solid transparent; padding: 0.625rem;
      border-radius: 0.5rem; color: #94a3b8; transition: all 0.2s ease;
  }
  .view-toggle-button.active { color: #3b82f6; background-color: #eff6ff; }
    
  .custom-select-panel { 
      max-height: 250px; overflow-y: auto; 
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); 
      border: 1px solid #f1f5f9; 
  }
    
  #autocomplete-list { 
      max-height: 250px; overflow-y: auto; 
      border: 1px solid #f1f5f9; 
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); 
  }
  #autocomplete-list div:hover { background-color: #f8fafc; }

  /* Estilos específicos da área de Conta */
  .tag-button {
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      border: 1px solid #e5e7eb;
      background-color: white;
      color: #374151;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
  }
  .tag-button:hover { background-color: #f9fafb; border-color: #d1d5db; }
  .tag-button.active { background-color: #eff6ff; color: #2563eb; border-color: #2563eb; }

  .form-label { display: block; font-size: 0.75rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .form-input { display: block; width: 100%; border-radius: 0.5rem; border: 1px solid #d1d5db; padding: 0.75rem; font-size: 0.875rem; color: #111827; transition: border-color 0.2s; }
  .form-input:focus { outline: none; border-color: #2563eb; ring: 2px solid #eff6ff; }
  .input-with-icon { position: relative; }
  .input-with-icon input { padding-right: 2.5rem; }
  .input-with-icon i { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #9ca3af; }

  .btn-primary {
      background-color: #0d9488;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  .btn-primary:hover {
      background-color: #0f766e;
  }

  .btn-secondary {
      background-color: white;
      color: #64748b;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      border: 1px solid #e2e8f0; 
      cursor: pointer;
      transition: all 0.2s;
  }
  .btn-secondary:hover {
      background-color: #f8fafc;
      color: #334155;
      border-color: #cbd5e1;
  }
`;

// Loader full-screen (bonito e consistente)
function LoadingScreen({ label = 'Iniciando…' }) {
  // Loader inspirado no HTML que você enviou, convertido para React
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState(label);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 4;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        setText('Bem-vindo');
        clearInterval(iv);
      } else {
        setProgress(p);
      }
    }, 50);

    return () => {
      clearInterval(iv);
      document.body.style.overflow = prevOverflow || 'auto';
    };
  }, []);

  return (
    <div id="loader-wrapper" className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;600;700&display=swap');
        :root { --medical-primary: #0ea5e9; --medical-dark: #0f172a; }
        #loader-wrapper { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 50px -12px rgba(14, 165, 233, 0.15);
          padding: 3rem 4rem;
          border-radius: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .logo-text {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 30%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
        }
        .ecg-container { width: 240px; height: 80px; position: relative; }
        .ecg-svg { width: 100%; height: 100%; overflow: visible; }
        .ecg-bg {
          fill: none; stroke: #cbd5e1; stroke-width: 2; stroke-opacity: 0.3;
          stroke-linecap: round; stroke-linejoin: round;
        }
        .ecg-line {
          fill: none; stroke: #0ea5e9; stroke-width: 3;
          stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 600; stroke-dashoffset: 600;
          animation: ecgDash 2.5s infinite linear;
          filter: drop-shadow(0 0 6px rgba(14, 165, 233, 0.6));
        }
        @keyframes ecgDash { 0% { stroke-dashoffset: 600; } 50% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -600; } }
        .loading-info { display: flex; flex-direction: column; align-items: center; width: 100%; margin-top: 1.5rem; }
        .loading-label {
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.15em; color: #64748b; margin-bottom: 0.75rem;
        }
        .progress-track { width: 180px; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: linear-gradient(90deg, #0ea5e9, #38bdf8); width: 0%; border-radius: 10px; transition: width 0.1s linear; }
        .ambient-light { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; animation: floatAmbient 10s infinite ease-in-out alternate; pointer-events:none; }
        .orb-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, #bae6fd 0%, transparent 70%); }
        .orb-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, #e0f2fe 0%, transparent 70%); }
        @keyframes floatAmbient { to { transform: translate(30px, 30px); } }
      `}</style>

      <div className="ambient-light orb-1" />
      <div className="ambient-light orb-2" />

      <div className="glass-card">
        <div className="logo-text">MEDJVS</div>

        <div className="ecg-container">
          <svg className="ecg-svg" viewBox="0 0 300 100" aria-hidden="true">
            <defs>
              <path id="ecgPath" d="M0,50 L40,50 L55,50 L65,20 L80,80 L95,50 L120,50 L130,30 L140,60 L150,50 L300,50" />
            </defs>
            <use href="#ecgPath" className="ecg-bg" />
            <use href="#ecgPath" className="ecg-line" />
            <circle fill="#38bdf8" r="4" style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.9))' }}>
              <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto">
                <mpath href="#ecgPath" />
              </animateMotion>
            </circle>
          </svg>
        </div>

        <div className="loading-info">
          <div className="loading-label">{text}</div>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CURSOS (copiados do index.html) ---
const courses = [
  {
    "id": 1,
    "title": "Atualizações Para Residência Médica e Revalida",
    "category": "Revisão",
    "specialty": "",
    "teachers": "4 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1eGQPdQ1_CojEh6L0CTveZsQAPn_CG1oS?usp=drive_link",
    "image": "Imagens/logo-estrategiamed.png",
    "url": ""
  },
  {
    "id": 2,
    "title": "Cardiologia",
    "category": "2024",
    "specialty": "",
    "teachers": "7 Professores",
    "driveLink": "https://drive.google.com/drive/folders/166yD5_xofQdFSzA5-E7d7PLjQjE12wd9?usp=drive_link",
    "image": "Imagens/medgrupo-logo.jpg",
    "url": ""
  },
  {
    "id": 3,
    "title": "Cirurgia",
    "category": "2024",
    "specialty": "",
    "teachers": "9 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1BDVRDqPwgWlPsqzlR2ERtIftb2fwNYgi?usp=drive_link",
    "image": "Imagens/lm-logo.jpg",
    "url": ""
  },
  {
    "id": 4,
    "title": "Cronograma e Guias Estatísticos",
    "category": "Guia",
    "specialty": "",
    "teachers": "Drº. Eduardo João",
    "driveLink": "https://drive.google.com/drive/folders/1ZNplTcdvkess8oPOxkUCyR_IjZrkf9oC?usp=drive_link",
    "image": "Imagens/raciocinioClinicoEmergencia-logo.webp",
    "url": ""
  },
  {
    "id": 5,
    "title": "Curso Multimídia e Radiologia (Bônus)",
    "category": "Bônus",
    "specialty": "",
    "teachers": "2 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1qOULSLrAGEqCm4vRZoN-lYFI4NZrF1qo?usp=drive_link",
    "image": "Imagens/afya-logo.jpg",
    "url": ""
  },
  {
    "id": 6,
    "title": "Dermatologia",
    "category": "2024",
    "specialty": "",
    "teachers": "3 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1dp2EH-kNM5NPYeaTyJNP2YBXEQ6eXbXy?usp=drive_link",
    "image": "Imagens/neurofacil-logo.jpg",
    "url": ""
  },
  {
    "id": 7,
    "title": "Ginecologia",
    "category": "2024",
    "specialty": "",
    "teachers": "6 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1oy1MOL3X9Vy2WTOspbPZc1x9anym6d8P?usp=drive_link",
    "image": "Imagens/pszerado-logo.jpg",
    "url": ""
  },
  {
    "id": 8,
    "title": "Endocrinologia",
    "category": "2024",
    "specialty": "",
    "teachers": "4 Professores",
    "driveLink": "https://drive.google.com/drive/folders/15fz3Faks8MrYDRwmqxs3-GEIBZ8HLFyJ?usp=drive_link",
    "image": "Imagens/simm-logo.png",
    "url": ""
  },
  {
    "id": 9,
    "title": "Hematologia",
    "category": "2024",
    "specialty": "",
    "teachers": "3 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1dgaEtPzHrCDY7Rcq3st7vmtPGbkKeAy8?usp=drive_link",
    "image": "Imagens/ianward-logo.jpeg",
    "url": ""
  },
  {
    "id": 10,
    "title": "Hepatologia",
    "category": "2024",
    "specialty": "",
    "teachers": "2 Professores",
    "driveLink": "https://drive.google.com/drive/folders/18_JCUHK2y-x7sxNkknK-u1PTo1AO5lFF?usp=drive_link",
    "image": "Imagens/oftreview-logo.jpg",
    "url": ""
  },
  {
    "id": 11,
    "title": "Medicina Preventiva",
    "category": "2024",
    "specialty": "",
    "teachers": "4 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1MysKJnL8jR1GqZrEpJwKoYAN7Qdc9JDM?usp=drive_link",
    "image": "Imagens/medreview-logo.png",
    "url": ""
  },
  {
    "id": 12,
    "title": "Infectologia",
    "category": "2024",
    "specialty": "",
    "teachers": "5 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1AcoBsbnlP4mX2ygoOMjFfqHuYNLpK2vi?usp=drive_link",
    "image": "Imagens/tdc-logo.jpg",
    "url": ""
  },
  {
    "id": 13,
    "title": "Gastroenterologia",
    "category": "2024",
    "specialty": "",
    "teachers": "5 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1Z_vpQfOZLkyGu3NMaz82C1pLLPfTvcC0?usp=drive_link",
    "image": "Imagens/medcof-logo.jpg",
    "url": ""
  },
  {
    "id": 14,
    "title": "Obstetrícia",
    "category": "2024",
    "specialty": "",
    "teachers": "2 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1RJABk5JK75LCIC735K1n56kPI3gWeaTd?usp=drive_link",
    "image": "Imagens/casalmedresumos-logo.jpg",
    "url": ""
  },
  {
    "id": 15,
    "title": "Nefrologia",
    "category": "2024",
    "specialty": "",
    "teachers": "3 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1to463vVYk9DB7sX--hLIblY7TQkgIL3j?usp=drive_link",
    "image": "Imagens/cma4edi-logo.webp",
    "url": ""
  },
  {
    "id": 16,
    "title": "Neurologia",
    "category": "2024",
    "specialty": "",
    "teachers": "5 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1Skrz3DbqeEUayGbq-tJjGwFGSVpY1pqm?usp=drive_link",
    "image": "Imagens/cma3edi-logo.png",
    "url": ""
  },
  {
    "id": 17,
    "title": "Oftalmologia",
    "category": "2024",
    "specialty": "",
    "teachers": "2 Professores",
    "driveLink": "#",
    "image": "Imagens/cardiologia-logo.jpg",
    "url": ""
  },
  {
    "id": 18,
    "title": "Pediatria",
    "category": "2024",
    "specialty": "",
    "teachers": "2 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1gHzWvFPJvqFmzUTf_vleEFLQVaolGv1P?usp=drive_link",
    "image": "Imagens/psiquiatria-pratica-logo.png",
    "url": ""
  },
  {
    "id": 19,
    "title": "Pneumologia",
    "category": "2024",
    "specialty": "",
    "teachers": "3 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1A39rmG1Km6xoprTdUJROWypgDoeVsGhA?usp=drive_link",
    "image": "Imagens/hcx-logo.png",
    "url": ""
  },
  {
    "id": 20,
    "title": "Psiquiatria",
    "category": "2025",
    "specialty": "",
    "teachers": "4 Professores",
    "driveLink": "https://drive.google.com/drive/folders/1fvmXJ26JgIURuZDvY7AGtsuBk2qaLW0t?usp=drive_link",
    "image": "Imagens/neuropost-logo.jpg",
    "url": ""
  }
];

// ============================================================================
// FIREBASE (Auth + Firestore + Storage)
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAHrOwcOuEp4uaQpq6ntmw3d0O3zsv1QU8",
  authDomain: "medicinajvs-e6f81.firebaseapp.com",
  projectId: "medicinajvs-e6f81",
  storageBucket: "medicinajvs-e6f81.firebasestorage.app",
  messagingSenderId: "550614193077",
  appId: "1:550614193077:web:ec11fe90db0d7d3a33bffc",
  measurementId: "G-RFF2NCK5F5"
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Helpers
const normalizeText = (str = "") =>
  str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();


// --- COMPONENTE FOOTER (REUTILIZÁVEL) ---
const Footer = () => (
  <footer className="w-full mt-12 border-t border-slate-200 bg-white">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 text-center">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">Medicina JVS</span> · Estudos médicos com foco em prática e performance.
          <div className="mt-1 text-xs text-slate-400">© {new Date().getFullYear()} Medicina JVS. Todos os direitos reservados.</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <a href={withBase(`${INSTITUTIONAL_BASE}/suporte.html`)} className="text-slate-600 hover:text-slate-900" target="_blank" rel="noreferrer">Suporte</a>
          <a href={withBase(`${INSTITUTIONAL_BASE}/politicaPrivacidade.html`)} className="text-slate-600 hover:text-slate-900" target="_blank" rel="noreferrer">Privacidade</a>
          <a href={withBase(`${INSTITUTIONAL_BASE}/termosUso.html`)} className="text-slate-600 hover:text-slate-900" target="_blank" rel="noreferrer">Termos</a>
          <a href={withBase(`${INSTITUTIONAL_BASE}/cookies.html`)} className="text-slate-600 hover:text-slate-900" target="_blank" rel="noreferrer">Cookies</a>
        </div>

        <div className="text-sm text-slate-500">
          <div className="font-semibold text-slate-700">Contato</div>
          <div className="text-slate-600">suporte@medicinajvs.com</div>
        </div>
      </div>
    </div>
  </footer>
);


// --- COMPONENTE: COMING SOON ---
const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
      // Mantém a contagem contínua entre recarregamentos (não reinicia ao abrir a página)
      const KEY = 'medjvs_launchAtMs';
      let targetMs = Number(localStorage.getItem(KEY) || 0);

      // Se ainda não existe um alvo, define uma data-alvo fixa 15 dias à frente (uma única vez)
      if (!targetMs || Number.isNaN(targetMs)) {
          targetMs = Date.now() + 15 * 24 * 60 * 60 * 1000;
          localStorage.setItem(KEY, String(targetMs));
      }

      const updateCountdown = () => {
          const distance = targetMs - Date.now();

          if (distance <= 0) {
              setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
              return;
          }

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
  }, []);
const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
      <div className="coming-soon-fixed font-sans text-slate-800 flex flex-col min-h-screen bg-slate-50 pt-24">
          <style>{ComingSoonCSS}</style>
            
          <main className="flex-grow flex items-center justify-center p-4 relative w-full">
              <div className="z-10 w-full max-w-3xl text-center space-y-8 animate-slide-up">
                  <div className="mb-8">
                      <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wider border border-blue-200">
                          NOVAS EXPERIÊNCIAS
                      </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-800 pb-2">Em Breve</h1>
                  <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                      Estamos a trabalhar arduamente nos bastidores para criar algo incrível para si. 
                      O nosso novo site será lançado muito em breve.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto py-8">
                      {['Dias', 'Horas', 'Minutos', 'Segundos'].map((unit, index) => {
                          const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][index];
                          return (
                              <div key={unit} className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col items-center justify-center hover:shadow-lg transition duration-300">
                                  <span className={`text-3xl md:text-4xl font-bold mb-1 ${index === 3 ? 'text-blue-600' : 'text-slate-800'}`}>{formatTime(value)}</span>
                                  <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{unit}</span>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </main>
          <Footer />
      </div>
  );
};

// --- LOGIN PAGE ---
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
      document.body.classList.add('login-mode');
      document.body.classList.remove('dashboard-mode');
      document.body.classList.remove('sidebar-expanded');
      return () => {
          document.body.classList.remove('login-mode');
      };
  }, []);

  const showToastMessage = (message, type = 'success') => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  };

  const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
          const user = cred.user;

          // Sempre exige verificação de email para entrar
          if (!user.emailVerified) {
              await sendEmailVerification(user);
              showToastMessage('Enviamos um e-mail de verificação. Verifique sua caixa de entrada.', 'success');
              navigate('/verifique-email', { replace: true });
              return;
          }

          navigate('/app', { replace: true });
      } catch (err) {
          const msg =
            err?.code === 'auth/invalid-credential' ? 'Email ou senha inválidos.' :
            err?.code === 'auth/user-not-found' ? 'Usuário não encontrado.' :
            err?.code === 'auth/too-many-requests' ? 'Muitas tentativas. Aguarde um pouco e tente novamente.' :
            'Não foi possível fazer login. Tente novamente.';
          showToastMessage(msg, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleResetPassword = async () => {
      const mail = email.trim();
      if (!mail) {
          showToastMessage('Digite seu e-mail para receber o link de redefinição.', 'error');
          return;
      }
      setIsLoading(true);
      try {
          await sendPasswordResetEmail(auth, mail);
          showToastMessage('Enviamos um link de redefinição de senha para seu e-mail.', 'success');
      } catch (err) {
          const msg =
            err?.code === 'auth/user-not-found' ? 'Não encontramos um usuário com esse e-mail.' :
            err?.code === 'auth/invalid-email' ? 'E-mail inválido.' :
            'Não foi possível enviar o e-mail de redefinição.';
          showToastMessage(msg, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  return (
      <div className="min-h-screen w-full grid place-items-center px-4">
          <style>{LoginCSS}</style>

          {/* Toast */}
          {toast.show && (
              <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                  {toast.message}
              </div>
          )}

          <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
              <div className="p-8">
                  <div className="mb-8 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
                      <h1 className="text-2xl font-bold text-slate-900">Acessar Plataforma</h1>
                      <p className="text-slate-500 mt-1">Entre com seu e-mail e senha</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                          <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="seuemail@exemplo.com"
                              required
                          />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                          <div className="relative">
                              <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="••••••••"
                                  required
                              />
                              <button
                                  type="button"
                                  onClick={() => setShowPassword((s) => !s)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                              >
                                  {showPassword ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.77 21.77 0 0 1 5.06-6.94"/>
                                        <path d="M1 1l22 22"/>
                                        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a21.77 21.77 0 0 1-4.87 6.85"/>
                                        <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"/>
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                      </svg>
                                    )}
                              </button>
                          </div>
                      </div>

                      <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition disabled:opacity-60"
                      >
                          {isLoading ? 'Entrando...' : 'Entrar'}
                      </button>

                      <div className="flex items-center justify-center">
                          <button
                              type="button"
                              onClick={handleResetPassword}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 hover:border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
                          >
                              Esqueci minha senha
                          </button>
                      </div>

                      <div className="pt-2 text-center text-xs text-slate-500">
                          Precisa de acesso? Fale com o suporte.
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                          <a href={withBase(`${INSTITUTIONAL_BASE}/suporte.html`)} className="hover:text-slate-800 hover:underline" target="_blank" rel="noreferrer">Suporte</a>
                          <a href={withBase(`${INSTITUTIONAL_BASE}/politicaPrivacidade.html`)} className="hover:text-slate-800 hover:underline" target="_blank" rel="noreferrer">Privacidade</a>
                          <a href={withBase(`${INSTITUTIONAL_BASE}/termosUso.html`)} className="hover:text-slate-800 hover:underline" target="_blank" rel="noreferrer">Termos</a>
                          <a href={withBase(`${INSTITUTIONAL_BASE}/cookies.html`)} className="hover:text-slate-800 hover:underline" target="_blank" rel="noreferrer">Cookies</a>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  );
};


// --- VERIFY EMAIL PAGE (bloqueia acesso até verificar) ---
const VerifyEmailPage = ({ authUser }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSending, setIsSending] = useState(false);

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  };

  useEffect(() => {
    document.body.classList.add('login-mode');
    document.body.classList.remove('dashboard-mode');
    document.body.classList.remove('sidebar-expanded');
    return () => document.body.classList.remove('login-mode');
  }, []);

  const handleResend = async () => {
    if (!authUser) return;
    setIsSending(true);
    try {
      await sendEmailVerification(authUser);
      showToastMessage('E-mail de verificação reenviado.', 'success');
    } catch (e) {
      showToastMessage('Não foi possível reenviar. Tente novamente.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleIAlreadyVerified = async () => {
    if (!authUser) return;
    try {
      await authUser.reload();
      if (authUser.emailVerified) {
        navigate('/app', { replace: true });
      } else {
        showToastMessage('Ainda não consta como verificado. Atualize após confirmar no e-mail.', 'error');
      }
    } catch {
      showToastMessage('Falha ao atualizar status. Tente novamente.', 'error');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/entrar', { replace: true });
  };

  return (
    <div className="min-h-screen w-full grid place-items-center px-4">
      <style>{LoginCSS}</style>

      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">✓</div>
          <h1 className="text-2xl font-bold text-slate-900">Verifique seu e-mail</h1>
          <p className="text-slate-600 mt-2">
            Enviamos um link de verificação para <span className="font-semibold">{authUser?.email}</span>.
            Você precisa confirmar para acessar a plataforma.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleIAlreadyVerified}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition"
            >
              Já verifiquei, continuar
            </button>

            <button
              onClick={handleResend}
              disabled={isSending}
              className="w-full rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-3 transition disabled:opacity-60"
            >
              {isSending ? 'Reenviando...' : 'Reenviar e-mail'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl text-slate-500 hover:text-slate-700 text-sm py-2"
            >
              Sair
            </button>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            Dica: verifique também spam/lixo eletrônico.
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD ---
const Dashboard = ({ authUser, userData, setUserData, userRole, courses }) => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState('courses-view');
  const [headerTitle, setHeaderTitle] = useState('Meus Cursos');
    
  // Estado para gerenciar abas da conta e edições
  const [activeAccountTab, setActiveAccountTab] = useState('access-content'); // Iniciar na aba de acessos como na imagem
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingData, setIsEditingData] = useState(false);
    
  // Estado do Usuário e Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [notifications, setNotifications] = useState(3);
    
  // Controles de Dropdown e Menus
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNavSelect, setShowNavSelect] = useState(false);
  const [showSpecialtySelect, setShowSpecialtySelect] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // --- CORREÇÃO 1: EFEITO DE CLASSE NO BODY PARA O SIDEBAR ---
  useEffect(() => {
    document.body.classList.add('dashboard-mode');
    document.body.classList.remove('login-mode');
      
    // Aplicar classe de expansão baseada no estado
    if (sidebarExpanded) {
        document.body.classList.add('sidebar-expanded');
    } else {
        document.body.classList.remove('sidebar-expanded');
    }

    return () => {
        document.body.classList.remove('dashboard-mode');
        document.body.classList.remove('sidebar-expanded');
    };
  }, [sidebarExpanded]); // Dependência adicionada

  // CARREGAR DADOS DO USUÁRIO LOGADO
  useEffect(() => {
    const currentUserEmail = localStorage.getItem('medJVS_currentUserEmail');
    if (currentUserEmail) {
        const storedData = localStorage.getItem(`medJVS_data_${currentUserEmail}`);
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }
  }, []);

  // Função auxiliar para salvar dados do usuário no localStorage
  const saveUserData = async (newData) => {
    const updatedData = { ...(userData || {}), ...newData, updatedAt: serverTimestamp() };
    setUserData((prev) => ({ ...(prev || {}), ...newData }));
    if (!authUser) return;
    try {
      await updateDoc(doc(db, 'users', authUser.uid), updatedData);
    } catch {
      // fallback: se o doc não existir ainda
      try {
        await setDoc(doc(db, 'users', authUser.uid), { ...updatedData, createdAt: serverTimestamp() }, { merge: true });
      } catch {}
    }
  };

  const handleLogout = async (e) => { e.preventDefault(); await signOut(auth); navigate('/entrar', { replace: true }); };
  const handleSidebarHover = (isHovering) => setSidebarExpanded(isHovering);
    
  // Navegação Principal
  const handleSidebarClick = (viewId, title) => { setCurrentView(viewId); setHeaderTitle(title); };
    
  // Ações do Menu de Perfil (Dropdown)
  const handleProfileMenuAction = (view, tab) => {
      setCurrentView(view);
      setHeaderTitle('Minha Conta');
      setActiveAccountTab(tab);
      setShowProfileMenu(false);
      setIsEditingProfile(false); // Resetar modo edição ao navegar
      setIsEditingData(false);
  };

  const toggleFavorite = (courseId) => {
    const currentFavorites = userData.favorites || [];
    let newFavorites;
    if (currentFavorites.includes(courseId)) {
        newFavorites = currentFavorites.filter(id => id !== courseId);
    } else {
        newFavorites = [...currentFavorites, courseId];
    }
    saveUserData({ favorites: newFavorites });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Formato inválido. Use JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Use até 5MB.');
      return;
    }

    try {
      const path = `users/${authUser.uid}/profile.jpg`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, file, { contentType: file.type });
      const url = await getDownloadURL(ref);
      await saveUserData({ image: url });
    } catch (err) {
      console.error(err);
      alert('Não foi possível enviar a imagem.');
    }
  };

  const addToHistory = (course) => { console.log("Acessando curso:", course.title); };
  const handleSearchInput = (e) => { const term = e.target.value; setSearchTerm(term); setShowAutocomplete(term.length > 0); };
    
  const filteredCourses = (courses || []).filter((course) => {
    const q = normalizeText(searchTerm);
    const hay = normalizeText(
      [
        course.title,
        course.searchTitle,
        course.category,
        course.specialty,
        course.teachers,
        course.professor,
        Array.isArray(course.tags) ? course.tags.join(' ') : '',
      ].filter(Boolean).join(' ')
    );

    const matchesSearch = !q || hay.includes(q);
    const matchesSpecialty = !specialtyFilter || normalizeText(course.specialty || '').includes(normalizeText(specialtyFilter));
    return matchesSearch && matchesSpecialty;
  });
    
  const uniqueSpecialties = [...new Set((courses || []).map(c => c.specialty).filter(Boolean))].sort();
  const searchSuggestions = (courses || []).filter(item => searchTerm && (item.title || '').toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5);

  return (
    <>
      <style>{DashboardCSS}</style>
        
      {/* SIDEBAR */}
      <aside id="sidebar" className="shadow-xl" onMouseEnter={() => handleSidebarHover(true)} onMouseLeave={() => handleSidebarHover(false)}>
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 w-full overflow-y-auto sidebar-scrollable pt-6">
                <ul className="w-full px-3 space-y-2">
                    <li className="mb-8 pl-1">
                        <a href="#" className="sidebar-link hover:bg-transparent" onClick={(e) => e.preventDefault()}>
                            <div className="icon-container bg-teal-500 text-white shadow-md w-10 h-10 rounded-lg"><span className="font-bold text-lg">MJ</span></div>
                            <span className="logo-text text-xl font-bold text-slate-800 ml-3 tracking-tight">Medicina JVS</span>
                        </a>
                    </li>
                    {[
                        { id: 'study-desk-view', title: 'Mesa de estudo', icon: <path strokeWidth="1.5" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z M6 7h8M6 11h8" /> },
                        { id: 'courses-view', title: 'Meus Cursos', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /> },
                        { id: 'flashcards-view', title: 'Flashcards', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v13m-7-6h14M6 4h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" /> },
                        { id: 'questions-view', title: 'Questões', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                        { id: 'simulados-view', title: 'Simulados', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
                        { id: 'performance-view', title: 'Desempenho', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /> },
                        { id: 'rankings-view', title: 'Rankings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /> },
                        { id: 'cast-view', title: 'Cast', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /> },
                        { id: 'vip-view', title: 'Sala VIP', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
                        { id: 'favorites-view', title: 'Favoritos', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> }
                    ].map(link => (
                        <li key={link.id}>
                            <a href="#" title={link.title} className={`sidebar-link ${currentView === link.id ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleSidebarClick(link.id, link.title); }}>
                                <div className="icon-container"><svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{link.icon}</svg></div>
                                <span className="ms-4 sidebar-link-text font-medium">{link.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="main-layout-wrapper">
          
          {/* HEADER FIXO */}
          <div className="dashboard-header w-full">
            <div className="w-full px-4 md:px-8 py-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center"><span id="header-title" className="text-2xl font-bold text-slate-800 tracking-tight">{headerTitle}</span></div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => { setCurrentView('favorites-view'); setHeaderTitle('Favoritos'); }} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition shadow-sm">
                            <i className="fa-solid fa-heart"></i>
                            <span className="hidden sm:inline">Favoritos</span>
                            <span className="bg-white text-rose-500 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-1">{userData.favorites ? userData.favorites.length : 0}</span>
                        </button>
                        
                        <div className="relative">
                            <button className="bg-transparent text-slate-500 hover:text-slate-800 p-2 rounded-full hover:bg-gray-100 transition" onClick={(e) => { e.stopPropagation(); setShowNotificationPanel(!showNotificationPanel); setShowProfileMenu(false); }}>
                                <i className="fa-regular fa-bell text-xl"></i>
                                {notifications > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">{notifications}</span>}
                            </button>
                             {showNotificationPanel && (
                                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="bg-teal-600 text-white p-4 flex justify-between items-center"><h3 className="font-bold text-lg">Notificações</h3><button onClick={() => setShowNotificationPanel(false)} className="text-white hover:text-teal-200"><i className="fa-solid fa-xmark"></i></button></div>
                                    <div className="p-2 max-h-96 overflow-y-auto bg-gray-50">
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-2"><span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded uppercase tracking-wider">News</span><h4 className="font-bold text-slate-800 mt-2 text-sm">MEC endurece avaliação</h4><p className="text-xs text-slate-500 mt-1">Novas regras para cursos de medicina.</p></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NOVO BOTÃO DE PERFIL COM DROPDOWN */}
                        <div className="relative">
                            <button id="profile-button" className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md overflow-hidden" onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowNotificationPanel(false); }}>
                                {userData.image ? <img src={userData.image} alt="Profile" className="w-full h-full object-cover" /> : (userData.name ? userData.name.charAt(0).toUpperCase() : 'U')}
                            </button>
                            
                            {showProfileMenu && (
                                <div id="profile-menu" className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-100">
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleProfileMenuAction('account-view', 'profile-content'); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="fa-regular fa-user w-6"></i>Minha conta</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleProfileMenuAction('account-view', 'data-content'); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="fa-solid fa-tag w-6"></i>Minhas compras</a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleProfileMenuAction('account-view', 'access-content'); }} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="fa-regular fa-circle-question w-6"></i>Ajuda</a>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <a href="#" onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="fa-solid fa-arrow-right-from-bracket w-6"></i>Sair</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtros - VISÍVEIS EM TODAS AS PÁGINAS */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full">
                    <div className="relative custom-select-container w-full md:w-auto md:min-w-[240px]">
                        <button onClick={() => setShowNavSelect(!showNavSelect)} className="filter-input w-full text-left flex justify-between items-center custom-select-trigger cursor-pointer hover:border-blue-400">
                            <span className="truncate">Navegar para...</span>
                            <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                        </button>
                        {showNavSelect && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg z-50 custom-select-panel">
                                <div className="p-3 text-sm cursor-pointer hover:bg-gray-50 text-slate-700" onClick={() => { handleSidebarClick('study-desk-view', 'Mesa de estudo'); setShowNavSelect(false); }}>Mesa de estudo</div>
                                <div className="p-3 text-sm cursor-pointer hover:bg-gray-50 text-slate-700" onClick={() => { handleSidebarClick('courses-view', 'Meus Cursos'); setShowNavSelect(false); }}>Meus Cursos</div>
                            </div>
                        )}
                    </div>

                    <div className="relative custom-select-container w-full md:w-auto md:min-w-[240px]">
                        <button onClick={() => setShowSpecialtySelect(!showSpecialtySelect)} className="filter-input w-full text-left flex justify-between items-center custom-select-trigger cursor-pointer hover:border-blue-400">
                            <span className="truncate">{specialtyFilter || "Todas as Especialidades"}</span>
                            <i className="fa-solid fa-chevron-down text-xs text-gray-400"></i>
                        </button>
                        {showSpecialtySelect && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg z-50 custom-select-panel max-h-60 overflow-y-auto">
                                <div className="p-3 text-sm cursor-pointer hover:bg-gray-50 text-slate-700 font-semibold" onClick={() => { setSpecialtyFilter(''); setShowSpecialtySelect(false); }}>Todas as Especialidades</div>
                                {uniqueSpecialties.map(spec => (
                                    <div key={spec} className="p-3 text-sm cursor-pointer hover:bg-gray-50 text-slate-700" onClick={() => { setSpecialtyFilter(spec); setShowSpecialtySelect(false); }}>{spec}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex-grow w-full md:w-auto">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                        </div>
                        <input type="text" value={searchTerm} onChange={handleSearchInput} placeholder="Buscar por título, categoria, professor..." className="filter-input w-full !pl-12 hover:border-blue-400 focus:border-blue-500" />
                        {showAutocomplete && searchSuggestions.length > 0 && (
                            <div id="autocomplete-list" className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg z-50 shadow-xl border border-gray-100">
                                {searchSuggestions.map(s => (
                                    <div key={s.id} onClick={() => { setSearchTerm(s.title); setShowAutocomplete(false); }} className="p-3 text-sm cursor-pointer hover:bg-gray-50 text-slate-700 border-b border-gray-50 last:border-0">{s.title}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shrink-0">
                        <button onClick={() => setIsGridView(true)} className={`view-toggle-button border-0 ${isGridView ? 'active shadow-sm' : 'hover:bg-gray-50'}`}><i className="fa-solid fa-grip"></i></button>
                        <button onClick={() => setIsGridView(false)} className={`view-toggle-button border-0 ${!isGridView ? 'active shadow-sm' : 'hover:bg-gray-50'}`}><i className="fa-solid fa-list"></i></button>
                    </div>
                </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <main id="main-content" className="flex-1 w-full px-4 md:px-8 pt-40 md:pt-40 pb-10 flex flex-col">
              <ErrorBoundary>

            <div className="w-full flex-grow">
                
                {/* 1. COURSES VIEW */}
                {currentView === 'courses-view' && (
                    <div id="courses-view" className="w-full animate-fade-in">
                      <CoursesGridLogoCards
                        title="Meus Cursos"
                        subtitle="Cursos disponíveis na Plataforma Medicina JVS."
                        onOpenCourse={(course) => {
                          // Ação padrão: abre o Drive do curso (quando liberado)
                          if (course?.driveUrl) {
                            window.open(course.driveUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      />
                    </div>
                )}

                {/* 2. FLASHCARDS VIEW */}
                {currentView === 'flashcards-view' && (
                  <div id="flashcards-view" className="w-full animate-fade-in">
                    <FlashcardsDashboard
                      authUser={authUser}
                      userRole={userRole}
                      db={db}
                    />
                  </div>
                )}

                {/* 3. FAVORITES VIEW */}
                {currentView === 'favorites-view' && (
                    <div id="favorites-view" className="w-full">
                        <div className="mb-8 border-b border-gray-200 pb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Meus Favoritos <span className="text-sm font-normal text-slate-500 ml-2">({userData.favorites ? userData.favorites.length : 0})</span></h2>
                        </div>
                        {userData.favorites && userData.favorites.length > 0 ? (
                            // Removi travas de largura e expandi o grid
                            <div id="favorites-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                {courses.filter(c => userData.favorites.includes(c.id)).map(course => (
                                    <div key={course.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
                                        <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
                                            <i className="fa-solid fa-image text-3xl opacity-50"></i>
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${course.tagColor}`}>{course.category}</span>
                                                <button onClick={() => toggleFavorite(course.id)} className="focus:outline-none transform active:scale-90 transition bg-transparent">
                                                    <i className="fa-solid fa-heart text-red-500 text-lg"></i>
                                                </button>
                                            </div>
                                            <h3 className="font-semibold text-gray-800 mb-2">{course.title}</h3>
                                            <button className="mt-auto w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => addToHistory(course)}>Acessar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 w-full">
                                <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-heart-crack text-3xl text-rose-300"></i></div>
                                <h3 className="mt-2 text-xl font-bold text-slate-800">Nenhum favorito ainda</h3>
                                <p className="mt-1 text-slate-500">Marque cursos com o coração para acessá-los rapidamente aqui.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. ACCOUNT VIEW (REFORMULADO - LARGURA TOTAL) */}
                {/* 3. ACCOUNT VIEW (CORREÇÃO DE LARGURA TOTAL E ESTILO) */}
                {/* 3. ACCOUNT VIEW (SOLUÇÃO DEFINITIVA: BLOCOS DE LARGURA TOTAL) */}
                {/* 3. ACCOUNT VIEW (CORREÇÃO DE LARGURA TOTAL E ESTILO) */}
                {currentView === 'account-view' && (
                    <div id="account-view" className="w-full flex flex-col animate-fade-in">
                        
                        {/* --- BANNER AZUL DE BOAS-VINDAS (LARGURA TOTAL) --- */}
                        <div className="w-full bg-blue-600 rounded-xl p-6 md:p-10 text-white relative overflow-hidden mb-8 shadow-lg flex flex-col md:flex-row items-center gap-6">
                            {/* Círculo da Foto */}
                            <div className="relative w-24 h-24 md:w-28 md:h-28 bg-teal-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/20 flex-shrink-0">
                                {userData.image ? (
                                    <img src={userData.image} alt="Perfil" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}</span>
                                )}
                            </div>

                            {/* Texto e Botão */}
                            <div className="flex-grow text-center md:text-left z-10">
                                <p className="text-blue-100 text-lg mb-1">Bem-vindo(a),</p>
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">{userData.name}</h2>
                                
                                <label className="inline-flex items-center gap-2 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg cursor-pointer transition-colors w-fit mx-auto md:mx-0">
                                    <i className="fa-solid fa-camera"></i>
                                    <span>Alterar foto</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>

                            {/* Decoração de Fundo */}
                            <div className="absolute -right-16 -bottom-32 w-80 h-80 bg-white/10 rounded-full pointer-events-none"></div>
                            <div className="absolute right-20 -top-20 w-40 h-40 bg-white/5 rounded-full pointer-events-none"></div>
                        </div>

                        {/* --- NAVEGAÇÃO DE ABAS (BOTÕES PRETOS) --- */}
                        <div className="w-full mb-8">
                            <nav className="flex flex-wrap gap-4 w-full">
                                {[
                                    { id: 'profile-content', icon: 'fa-user', label: 'Meu Perfil' },
                                    { id: 'data-content', icon: 'fa-address-card', label: 'Meus Dados' },
                                    { id: 'access-content', icon: 'fa-lock', label: 'Meus Acessos' },
                                    { id: 'donations-content', icon: 'fa-hand-holding-heart', label: 'Doações' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveAccountTab(tab.id)}
                                        className={`px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all transform active:scale-95 ${
                                            activeAccountTab === tab.id 
                                            ? 'bg-slate-900 text-white shadow-md' // Estilo Ativo (Preto)
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' // Estilo Inativo
                                        }`}
                                    >
                                        <i className={`fa-solid ${tab.icon}`}></i>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* --- CONTEÚDO DAS ABAS (OCUPANDO 100% DA LARGURA) --- */}
                        <div className="w-full">
                            
                            {/* ABA 1: MEU PERFIL */}
                            {activeAccountTab === 'profile-content' && (
                                <div className="animate-fade-in w-full">
                                    {/* Cabeçalho da Seção */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 w-full">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-4 md:mb-0">Detalhes do Perfil</h3>
                                        {!isEditingProfile && (
                                            <button onClick={() => setIsEditingProfile(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                                                <i className="fa-solid fa-pencil"></i>Editar Perfil
                                            </button>
                                        )}
                                    </div>

                                    {!isEditingProfile ? (
                                        /* Grid de Visualização - W-FULL aplicado */
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                            {/* Card 1 */}
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <i className="fa-solid fa-location-dot text-lg"></i>
                                                    </div>
                                                    <h4 className="font-bold text-gray-800 text-lg">Localização e Contato</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Cidade / Estado</p>
                                                        <p className="font-semibold text-gray-800">{userData.address?.city || 'Não informado'} - {userData.address?.state || ''}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Redes Sociais</p>
                                                        <p className="text-gray-500 italic">Nenhuma rede vinculada</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card 2 */}
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                                        <i className="fa-solid fa-align-left text-lg"></i>
                                                    </div>
                                                    <h4 className="font-bold text-gray-800 text-lg">Biografia</h4>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {userData.bio || 'Olá! Eu estou usando a plataforma Medicina JVS para impulsionar meus estudos.'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Modo Edição */
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                                                <div className="space-y-6 w-full">
                                                    <div>
                                                        <label className="form-label mb-2">Selecione seus Interesses</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['Medicina', 'Residência', 'Concursos', 'Cardiologia', 'Pediatria'].map(tag => (
                                                                <button key={tag} className="px-3 py-1 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors">{tag}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="form-label mb-2">Redes Sociais</label>
                                                        <div className="flex flex-wrap gap-3">
                                                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:border-pink-200"><i className="fa-brands fa-instagram"></i></button>
                                                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200"><i className="fa-brands fa-linkedin-in"></i></button>
                                                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-sky-500 hover:border-sky-200"><i className="fa-brands fa-twitter"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <label className="form-label mb-2">Biografia</label>
                                                    <textarea 
                                                        className="form-input h-48 resize-none w-full" 
                                                        placeholder="Conte um pouco sobre você..."
                                                        value={userData.bio || ''}
                                                        onChange={(e) => saveUserData({bio: e.target.value})}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50" onClick={() => setIsEditingProfile(false)}>Cancelar</button>
                                                <button className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 shadow-sm" onClick={() => setIsEditingProfile(false)}>Salvar Alterações</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ABA 2: MEUS DADOS */}
                            {activeAccountTab === 'data-content' && (
                                <div className="animate-fade-in w-full">
                                    <div className="flex justify-between items-center mb-6 w-full">
                                        <h3 className="text-2xl font-bold text-slate-800">Meus Dados</h3>
                                        {!isEditingData && (
                                            <button onClick={() => setIsEditingData(true)} className="text-blue-600 font-medium hover:underline flex items-center gap-2">
                                                <i className="fa-solid fa-pen"></i>Editar
                                            </button>
                                        )}
                                    </div>

                                    {!isEditingData ? (
                                        <div className="space-y-6 w-full">
                                            {/* Card Dados Pessoais - Grid Responsivo (1 -> 2 -> 4 colunas) */}
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Informações Pessoais</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
                                                    <div><p className="text-xs text-gray-500 mb-1">Nome Completo</p><p className="font-semibold text-gray-900 break-words">{userData.name}</p></div>
                                                    <div><p className="text-xs text-gray-500 mb-1">CPF</p><p className="font-semibold text-gray-900">{userData.cpf || '***.***.***-**'}</p></div>
                                                    <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="font-semibold text-gray-900 break-words">{userData.email}</p></div>
                                                    <div><p className="text-xs text-gray-500 mb-1">Celular</p><p className="font-semibold text-gray-900">{userData.phone || '(00) 00000-0000'}</p></div>
                                                </div>
                                            </div>

                                            {/* Card Endereço */}
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Endereço</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                                    <div className="md:col-span-2"><p className="text-xs text-gray-500 mb-1">Logradouro</p><p className="font-semibold text-gray-900">{userData.address?.street || 'Não informado'}, {userData.address?.number}</p></div>
                                                    <div><p className="text-xs text-gray-500 mb-1">CEP</p><p className="font-semibold text-gray-900">{userData.address?.zip || '00000-000'}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                                                <div><label className="form-label">Nome Completo</label><input type="text" className="form-input" value={userData.name} onChange={(e) => saveUserData({name: e.target.value})} /></div>
                                                <div><label className="form-label">Celular</label><input type="text" className="form-input" value={userData.phone} onChange={(e) => saveUserData({phone: e.target.value})} /></div>
                                                <div className="md:col-span-2"><label className="form-label">Email (Não editável)</label><input type="email" className="form-input bg-gray-50 text-gray-500" value={userData.email} disabled /></div>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50" onClick={() => setIsEditingData(false)}>Cancelar</button>
                                                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700" onClick={() => setIsEditingData(false)}>Salvar Dados</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ABA 3: MEUS ACESSOS */}
                            {activeAccountTab === 'access-content' && (
                                <div className="animate-fade-in w-full">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Meus Acessos</h3>
                                    <p className="text-gray-500 mb-6">Histórico de produtos adquiridos.</p>
                                    
                                    <div className="flex flex-col gap-4 w-full">
                                        {[
                                            { title: 'Extensivo Residência Médica 2026', status: 'Ativo', id: '#MED-9921' },
                                            { title: 'Curso de Procedimentos Práticos', status: 'Ativo', id: '#MED-9984' },
                                            { title: 'Mentoria Semestral', status: 'Expirado', id: '#MED-8122' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0 ${item.status === 'Ativo' ? 'bg-teal-500' : 'bg-gray-400'}`}>
                                                        <i className="fa-solid fa-graduation-cap"></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                                                        <p className="text-sm text-gray-500">ID do Pedido: {item.id}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                                    item.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}>
                                                    {item.status === 'Ativo' ? <><i className="fa-solid fa-circle-check mr-1.5"></i>Acesso Liberado</> : 'Expirado'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ABA 4: DOAÇÕES */}
                            {activeAccountTab === 'donations-content' && (
                                <div className="animate-fade-in w-full">
                                    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-10 text-white text-center shadow-lg">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                            <i className="fa-solid fa-heart text-3xl text-white"></i>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">Apoie o Projeto</h3>
                                        <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                                            Sua contribuição é fundamental para manter a plataforma ativa e trazer cada vez mais conteúdos de qualidade para estudantes de medicina.
                                        </p>
                                        <button className="bg-white text-indigo-600 font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200">
                                            Fazer uma Doação
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {/* 4. OTHER VIEWS (Coming Soon) */}
                {/* Mostra "Em Breve" apenas nas views ainda não implementadas */}
                {!['courses-view', 'favorites-view', 'account-view', 'flashcards-view'].includes(currentView) && <ComingSoon />}

            </div>

              </ErrorBoundary>

            {/* Footer exibido para TODAS as views do Dashboard (Quando não é Coming Soon) */}
            {currentView !== 'undefined_view' && <Footer />}
          </main>
      </div>
    </>
  );
}

// --- ROTAS ---

// --- PÁGINAS PÚBLICAS (HTML ACOPLADO) ---
// Renderiza os arquivos HTML (Privacidade/Termos/Suporte/Cookies) dentro do React, sem sair do app.
const extractFromHtml = (fullHtml = "") => {
  const headMatch = fullHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  const head = (headMatch?.[1] || "").trim();
  const body = (bodyMatch?.[1] || fullHtml).trim();

  // Pega apenas estilos do <head> (style e links de CSS). Mantém a aparência original quando possível.
  const headStyles = head
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .match(/<(style|link)[^>]*>/gi)?.join("\n") || "";

  const safeBody = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  return { headStyles, safeBody };
};

const PublicHtmlPage = ({ title, html }) => {
  useEffect(() => {
    document.body.classList.remove('dashboard-mode');
    document.body.classList.remove('sidebar-expanded');
    document.body.classList.add('login-mode');
    return () => {};
  }, []);

  const { headStyles, safeBody } = extractFromHtml(html);

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{LoginCSS}</style>

      {/* Estilos originais do HTML (quando existirem) */}
      {headStyles ? (
        <div dangerouslySetInnerHTML={{ __html: headStyles }} />
      ) : null}

      {/* Topbar simples */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/entrar" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
            <div className="font-semibold text-slate-800">Medicina JVS</div>
          </Link>

          <Link to="/entrar" className="text-sm text-blue-700 hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 md:p-10" dangerouslySetInnerHTML={{ __html: safeBody }} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

const PrivacyPage = () => <PublicHtmlPage title="Política de Privacidade" html={LEGAL_HTML.privacy} />;
const TermsPage   = () => <PublicHtmlPage title="Termos de Uso" html={LEGAL_HTML.terms} />;
const SupportPage = () => <PublicHtmlPage title="Central de Suporte" html={LEGAL_HTML.support} />;
const CookiesPage = () => <PublicHtmlPage title="Política de Cookies" html={LEGAL_HTML.cookies} />;


const PrivateRoute = ({ children, authReady, authUser }) => {
  if (!authReady) {
    return <LoadingScreen label="Preparando sua sessão…" />;
  }
  if (!authUser) return <Navigate to="/entrar" replace />;
  if (!authUser.emailVerified) return <Navigate to="/verifique-email" replace />;
  return children;
};


// ============================================================================
//  FLASHCARDS (Sistema completo em React + Firestore)
// ============================================================================

function dateKeyFromDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// SM-2 (revisão espaçada) simplificado e estável
function sm2Schedule({ easeFactor = 2.5, interval = 0, repetitions = 0 }, rating1to4) {
  // Map: 1=Errei, 2=Difícil, 3=Médio, 4=Fácil  -> quality 0..5
  const qualityMap = { 1: 1, 2: 2, 3: 4, 4: 5 };
  const q = qualityMap[rating1to4] ?? 3;

  let ef = easeFactor;
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  let reps = repetitions;
  let intv = interval;

  if (q < 3) {
    reps = 0;
    intv = 1;
  } else {
    reps = reps + 1;
    if (reps === 1) intv = 1;
    else if (reps === 2) intv = 6;
    else intv = Math.round(intv * ef);
  }

  return { easeFactor: ef, interval: intv, repetitions: reps, dueAt: addDays(new Date(), intv) };
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
      {children}
    </span>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
            Fechar
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false, error:null}; }
  static getDerivedStateFromError(error){ return {hasError:true, error}; }
  componentDidCatch(error, info){ console.error(error, info); }
  render(){
    if(this.state.hasError){
      return (
        <div className="min-h-screen w-full grid place-items-center p-6">
          <div className="max-w-xl w-full rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="text-lg font-bold text-red-800">Opa — algo deu errado nesta tela</div>
            <div className="mt-2 text-sm text-red-700 break-words">{String(this.state.error)}</div>
            <button className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white" onClick={() => window.location.reload()}>
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function FlashcardsDashboard({ authUser, userRole, db }) {
  const uid = authUser?.uid;
  const isAdmin = userRole === 'admin';

  const [loading, setLoading] = useState(true);
  const [decks, setDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState('all');
  const [mode, setMode] = useState('today'); // today | free | manage
  const [queryText, setQueryText] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState(new Set());
  const [excludeSeen, setExcludeSeen] = useState(false);
  const [excludeMastered, setExcludeMastered] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // all | 1 | 2 | 3 | 4


  // Study state
  const [studyQueue, setStudyQueue] = useState([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  // Metrics
  const [metrics, setMetrics] = useState({ studiedToday: 0, accuracyToday: 0, streak: 0, dueNow: 0 });
  const [dailySeries, setDailySeries] = useState([]); // last 14 days
  const [calendarDays, setCalendarDays] = useState([]); // current month grid
  const chartRef = useRef(null);
  const chartInst = useRef(null);

  // Manage
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckTags, setNewDeckTags] = useState('');
  const [selectedManageDeck, setSelectedManageDeck] = useState(null);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardTags, setNewCardTags] = useState('');
  const [bulkCsv, setBulkCsv] = useState('');
  const [toast, setToast] = useState(null);

  function notify(msg, kind = 'info') {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2800);
  }

  // --- Load decks (one-time) — evita bug de listener (onSnapshot) no Vite/HMR
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const decksCol = collection(db, 'users', uid, 'flashDecks');
        const qy = query(decksCol, orderBy('createdAt', 'desc'));
        const snap = await getDocs(qy);
        if (cancelled) return;
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDecks(list);
      } catch (e) {
        console.error('Erro ao carregar decks:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, db]);

  // --- Due count + Today metrics + streak + chart series (last 14 days)
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    (async () => {
      try {
        const todayKey = dateKeyFromDate(new Date());
        const dailyCol = collection(db, 'users', uid, 'flashDaily');
        const qDays = query(dailyCol, orderBy('dateKey', 'desc'), limit(60));
        const snap = await getDocs(qDays);
        if (cancelled) return;

        const days = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const today = days.find((d) => d.dateKey === todayKey);
        const studiedToday = Number(today?.studied || 0);
        const correctToday = Number(today?.correct || 0);
        const accuracyToday = studiedToday > 0 ? Math.round((correctToday / studiedToday) * 100) : 0;

        // streak: count consecutive days back from today with studied>0
        const byKey = new Map(days.map((d) => [d.dateKey, d]));
        let streak = 0;
        let cursor = new Date();
        for (let i = 0; i < 365; i++) {
          const k = dateKeyFromDate(cursor);
          const entry = byKey.get(k);
          if (entry && Number(entry.studied || 0) > 0) streak += 1;
          else break;
          cursor = addDays(cursor, -1);
        }

        // last 14 days series (chronological)
        const series = [];
        for (let i = 13; i >= 0; i--) {
          const d = addDays(new Date(), -i);
          const k = dateKeyFromDate(d);
          const e = byKey.get(k);
          series.push({
            dateKey: k,
            studied: Number(e?.studied || 0),
            correct: Number(e?.correct || 0),
            incorrect: Number(e?.incorrect || 0),
          });
        }
        setDailySeries(series);

        // due now: cards due across all decks
        let dueNow = 0;
        for (const dk of decks) {
          const cardsCol = collection(db, 'users', uid, 'flashDecks', dk.id, 'cards');
          // fetch only small batch; if decks are huge, we'd paginate later
          const cardsSnap = await getDocs(cardsCol);
          if (cancelled) return;
          cardsSnap.forEach((cd) => {
            const c = cd.data();
            const dueAt = c.dueAt?.toMillis ? c.dueAt.toMillis() : (typeof c.dueAt === 'number' ? c.dueAt : 0);
            if (dueAt && dueAt <= Date.now()) dueNow += 1;
          });
        }

        setMetrics({ studiedToday, accuracyToday, streak, dueNow });
      } catch (e) {
        console.error('Erro ao carregar métricas:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, db, decks]);

  // --- Build calendar grid (current month) + mark studied counts from dailySeries
  useEffect(() => {
    const today = new Date();
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startDow = first.getDay(); // 0 sun
    const totalDays = last.getDate();

    const studiedMap = new Map(dailySeries.map((d) => [d.dateKey, d.studied]));
    const grid = [];
    // pad previous month
    for (let i = 0; i < startDow; i++) grid.push({ key: `pad-${i}`, day: null, studied: 0, isToday: false });

    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(today.getFullYear(), today.getMonth(), day);
      const k = dateKeyFromDate(d);
      grid.push({
        key: k,
        day,
        studied: studiedMap.get(k) || 0,
        isToday: k === dateKeyFromDate(new Date()),
      });
    }
    setCalendarDays(grid);
  }, [dailySeries]);

  // --- Render/Update chart (Chart.js)
  useEffect(() => {
    if (!chartRef.current) return;
    const labels = dailySeries.map((d) => d.dateKey.slice(5));
    const studied = dailySeries.map((d) => d.studied);
    const correct = dailySeries.map((d) => d.correct);

    if (chartInst.current) {
      chartInst.current.data.labels = labels;
      chartInst.current.data.datasets[0].data = studied;
      chartInst.current.data.datasets[1].data = correct;
      chartInst.current.update();
      return;
    }

    chartInst.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Cards estudados', data: studied, tension: 0.25 },
          { label: 'Acertos', data: correct, tension: 0.25 },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { mode: 'index', intersect: false },
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });

    return () => {
      if (chartInst.current) {
        chartInst.current.destroy();
        chartInst.current = null;
      }
    };
  }, [dailySeries]);

  // --- Keyboard shortcuts (Space flip, 1-4 rate, arrows nav)
  useEffect(() => {
    function onKeyDown(e) {
      if (!studyQueue.length) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setShowBack((v) => !v);
      }
      if (['1', '2', '3', '4'].includes(e.key) && showBack) {
        e.preventDefault();
        rateCard(Number(e.key));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStudyIndex((i) => Math.max(0, i - 1));
        setShowBack(false);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setStudyIndex((i) => Math.min(studyQueue.length - 1, i + 1));
        setShowBack(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [studyQueue, showBack]);

  // --- Load queue for Today / Free
  async function loadQueue(nextMode = mode) {
    if (!uid) return;
    const now = new Date();
    const allDecks = selectedDeckId === 'all' ? decks : decks.filter((d) => d.id === selectedDeckId);

    const subjectSet = selectedDeckId === 'all' ? selectedSubjects : new Set();

    let pool = [];
    for (const deck of allDecks) {
      if (selectedDeckId === 'all' && subjectSet && subjectSet.size > 0 && !subjectSet.has(deck.name)) continue;
      const cardsCol = collection(db, 'users', uid, 'flashDecks', deck.id, 'cards');
      const cardsSnap = await getDocs(query(cardsCol, orderBy('createdAt', 'desc'), limit(600)));
      cardsSnap.docs.forEach((docSnap) => {
        const c = docSnap.data();
        const dueAt = c?.dueAt?.toDate ? c.dueAt.toDate() : null;
        const suspended = Boolean(c?.suspended);
        const okDue = dueAt ? dueAt <= now : true; // sem dueAt = novo card
        const okQuery = queryText ? (normalizeText(c.front).includes(normalizeText(queryText)) || normalizeText(c.back).includes(normalizeText(queryText)) || normalizeText((c.tags || []).join(' ')).includes(normalizeText(queryText))) : true;

        if (suspended) return;
        if (!okQuery) return;

        const seen = Boolean(c?.lastReviewedAt);
        const mastered = (c?.lastRating === 4);
        if (excludeSeen && seen) return;
        if (excludeMastered && mastered) return;
        if (difficultyFilter !== 'all') {
          if (!c?.lastRating) return;
          if (String(c.lastRating) !== String(difficultyFilter)) return;
        }

        if (nextMode === 'today') {
          if (okDue) pool.push({ id: docSnap.id, deckId: deck.id, deckName: deck.name, ...c });
        } else {
          pool.push({ id: docSnap.id, deckId: deck.id, deckName: deck.name, ...c });
        }
      });
    }

    // Free mode: shuffle and cap
    if (nextMode === 'free') pool = pool.sort(() => Math.random() - 0.5).slice(0, 40);
    // Today mode: due first
    if (nextMode === 'today') pool = pool.sort((a, b) => {
      const ad = a?.dueAt?.toDate ? a.dueAt.toDate().getTime() : 0;
      const bd = b?.dueAt?.toDate ? b.dueAt.toDate().getTime() : 0;
      return ad - bd;
    }).slice(0, 60);

    setStudyQueue(pool);
    setStudyIndex(0);
    setShowBack(false);

    if (!pool.length) {
      notify(nextMode === 'today' ? 'Nenhum card para hoje 🎉' : 'Nenhum card encontrado com os filtros atuais.');
    }
  }

  async function rateCard(rating) {
    const card = studyQueue[studyIndex];
    if (!card) return;

    try {
      const cardRef = doc(db, 'users', uid, 'flashDecks', card.deckId, 'cards', card.id);
      const current = {
        easeFactor: card.easeFactor ?? 2.5,
        interval: card.interval ?? 0,
        repetitions: card.repetitions ?? 0,
      };
      const sched = sm2Schedule(current, rating);

      await updateDoc(cardRef, {
        easeFactor: sched.easeFactor,
        interval: sched.interval,
        repetitions: sched.repetitions,
        dueAt: sched.dueAt,
        lastReviewedAt: new Date(),
        updatedAt: new Date(),
        lastRating: rating,
      });

      // Log + Daily aggregates
      const dateKey = dateKeyFromDate(new Date());
      const correct = rating >= 3;

      await addDoc(collection(db, 'users', uid, 'flashLogs'), {
        dateKey,
        deckId: card.deckId,
        deckName: card.deckName || '',
        cardId: card.id,
        rating,
        correct,
        reviewedAt: new Date(),
        ts: serverTimestamp(),
      });

      const dailyRef = doc(db, 'users', uid, 'flashDaily', dateKey);
      await setDoc(
        dailyRef,
        {
          dateKey,
          studied: 0,
          correct: 0,
          incorrect: 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(dailyRef, {
        studied: increment(1),
        correct: increment(correct ? 1 : 0),
        incorrect: increment(correct ? 0 : 1),
        updatedAt: serverTimestamp(),
      });

      // advance
      const nextIdx = Math.min(studyQueue.length - 1, studyIndex + 1);
      setStudyIndex(nextIdx);
      setShowBack(false);

      // update local queue for smoother UX
      setStudyQueue((q) =>
        q.map((x, idx) => (idx === studyIndex ? { ...x, ...sched } : x))
      );
    } catch (e) {
      notify('Erro ao salvar revisão. Verifique sua conexão e tente novamente.', 'error');
    }
  }

  async function createDeck() {
    if (!isAdmin) return;
    const name = newDeckName.trim();
    if (!name) return notify('Digite um nome para o deck.');
    const tags = newDeckTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await addDoc(collection(db, 'users', uid, 'flashDecks'), {
        name,
        tags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewDeckName('');
      setNewDeckTags('');
      notify('Deck criado com sucesso ✅');
    } catch {
      notify('Não foi possível criar o deck.', 'error');
    }
  }

  async function addCardToDeck() {
    if (!isAdmin) return;
    if (!selectedManageDeck) return notify('Selecione um deck.');
    const front = newCardFront.trim();
    const back = newCardBack.trim();
    if (!front || !back) return notify('Preencha frente e verso.');

    const tags = newCardTags.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      await addDoc(collection(db, 'users', uid, 'flashDecks', selectedManageDeck.id, 'cards'), {
        front,
        back,
        tags,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        dueAt: new Date(), // novo card cai "para hoje"
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewCardFront('');
      setNewCardBack('');
      setNewCardTags('');
      notify('Card adicionado ✅');
    } catch {
      notify('Erro ao adicionar card.', 'error');
    }
  }

  async function importCsv() {
    if (!isAdmin) return;
    if (!selectedManageDeck) return notify('Selecione um deck.');
    const text = bulkCsv.trim();
    if (!text) return notify('Cole o CSV (front;back;tags).');

    const rows = text.split('\n').map((r) => r.trim()).filter(Boolean);
    let ok = 0;
    let fail = 0;

    for (const row of rows) {
      const [front, back, tagsStr] = row.split(';').map((x) => (x ?? '').trim());
      if (!front || !back) { fail += 1; continue; }
      const tags = (tagsStr || '').split(',').map((t) => t.trim()).filter(Boolean);
      try {
        await addDoc(collection(db, 'users', uid, 'flashDecks', selectedManageDeck.id, 'cards'), {
          front,
          back,
          tags,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          dueAt: new Date(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        ok += 1;
      } catch {
        fail += 1;
      }
    }

    notify(`Importação concluída: ${ok} ok, ${fail} falharam.`);
    setBulkCsv('');
  }

  const filteredDecks = decks.filter((d) => {
    const qn = normalizeText(queryText);
    if (!qn) return true;
    return normalizeText(d.name).includes(qn) || normalizeText((d.tags || []).join(' ')).includes(qn);
  });

  const activeCard = studyQueue[studyIndex];

  return (
    <div className="w-full">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999]">
          <div className="px-4 py-3 rounded-xl bg-slate-900 text-white shadow-lg border border-white/10">
            {toast.msg}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Flashcards</h2>
          <p className="text-slate-600">
            Revisão espaçada (SM-2), treino livre, filtros e métricas por usuário.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setMode('today'); loadQueue('today'); }}
            className={`px-4 py-2 rounded-xl font-semibold transition border ${mode === 'today' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'}`}
          >
            Cards para hoje
          </button>
          <button
            onClick={() => { setMode('free'); loadQueue('free'); }}
            className={`px-4 py-2 rounded-xl font-semibold transition border ${mode === 'free' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'}`}
          >
            Treino livre
          </button>
          {isAdmin && (
            <button
              onClick={() => setMode('manage')}
              className={`px-4 py-2 rounded-xl font-semibold transition border ${mode === 'manage' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'}`}
            >
              Gerenciar
            </button>
          )}
          <button
            onClick={() => setShowTutorial(true)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition"
          >
            Tutorial
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cards estudados hoje</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.studiedToday}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Acertos hoje</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.accuracyToday}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sequência</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.streak} dias</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cards para revisar</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{metrics.dueNow}</div>
        </div>
      </div>

      {/* Filtros + Decks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Filtros</h3>
            <Badge>{selectedDeckId === 'all' ? 'Todos os decks' : 'Deck selecionado'}</Badge>
          </div>

          <button type="button" onClick={() => setShowFilters(true)} className="w-full mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100">
            Filtros de assuntos
            <div className="mt-1 text-xs font-normal text-slate-500">{selectedDeckId !== 'all' ? `Deck: ${decks.find(d=>d.id===selectedDeckId)?.name || '—'}` : (selectedSubjects.size ? `${selectedSubjects.size} selecionado(s)` : 'Todos')}</div>
          </button>

          <label className="text-sm font-semibold text-slate-700">Buscar</label>
          <input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Ex.: cardio, antibiótico, ECG..."
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <label className="mt-4 block text-sm font-semibold text-slate-700">Deck</label>
          <select
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            {filteredDecks.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => loadQueue(mode)}
              className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Aplicar
            </button>
            <button
              onClick={() => { setQueryText(''); setSelectedDeckId('all'); }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition"
            >
              Limpar
            </button>
          </div>

          {!isAdmin && (
            <p className="mt-4 text-xs text-slate-500">
              Dica: se você não encontrar cards, peça ao administrador para criar decks e adicionar cards.
            </p>
          )}
        </div>

        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900">Evolução (últimos 14 dias)</h3>
            <div className="text-xs text-slate-500">Cards estudados vs acertos</div>
          </div>
          <div className="h-64">
            <canvas ref={chartRef} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Área principal: Estudo / Calendário / Gerenciar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estudo */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Estudando</h3>
              <p className="text-sm text-slate-600">
                Atalhos: <b>Espaço/Enter</b> (virar), <b>1–4</b> (avaliar), <b>← →</b> (navegar)
              </p>
            </div>
            <div className="text-sm text-slate-600">
              {studyQueue.length ? (
                <span>
                  {studyIndex + 1}/{studyQueue.length}
                </span>
              ) : (
                <span>—</span>
              )}
            </div>
          </div>

          <div className="mt-5">
            {!studyQueue.length ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center">
                <div className="text-slate-800 font-semibold">Nenhum card carregado</div>
                <div className="text-slate-600 text-sm mt-1">
                  Use “Cards para hoje” ou “Treino livre” e aplique filtros se quiser.
                </div>
                <div className="mt-4 flex justify-center gap-3">
                  <button onClick={() => { setMode('today'); loadQueue('today'); }} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                    Cards para hoje
                  </button>
                  <button onClick={() => { setMode('free'); loadQueue('free'); }} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition">
                    Treino livre
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge>{activeCard?.deckName || 'Deck'}</Badge>
                    {Array.isArray(activeCard?.tags) && activeCard.tags.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {activeCard?.dueAt?.toDate ? `Próxima revisão: ${activeCard.dueAt.toDate().toLocaleDateString()}` : 'Novo card'}
                  </div>
                </div>

                <div
                  className="rounded-2xl border border-slate-200 p-6 bg-slate-50 min-h-[220px] cursor-pointer select-none"
                  onClick={() => setShowBack((v) => !v)}
                  title="Clique para virar (ou Espaço/Enter)"
                >
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {showBack ? 'Resposta' : 'Pergunta'}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-slate-900 whitespace-pre-wrap">
                    {showBack ? (activeCard?.back || '') : (activeCard?.front || '')}
                  </div>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setStudyIndex((i) => Math.max(0, i - 1)); setShowBack(false); }} className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold">
                      ← Voltar
                    </button>
                    <button onClick={() => { setStudyIndex((i) => Math.min(studyQueue.length - 1, i + 1)); setShowBack(false); }} className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold">
                      Avançar →
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button disabled={!showBack} onClick={() => rateCard(1)} className={`px-4 py-2 rounded-xl font-semibold ${showBack ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                      1 · Errei
                    </button>
                    <button disabled={!showBack} onClick={() => rateCard(2)} className={`px-4 py-2 rounded-xl font-semibold ${showBack ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                      2 · Difícil
                    </button>
                    <button disabled={!showBack} onClick={() => rateCard(3)} className={`px-4 py-2 rounded-xl font-semibold ${showBack ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                      3 · Médio
                    </button>
                    <button disabled={!showBack} onClick={() => rateCard(4)} className={`px-4 py-2 rounded-xl font-semibold ${showBack ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                      4 · Fácil
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Clique no card para virar, depois avalie. O sistema programa a próxima revisão automaticamente.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lateral: Calendário + Notificações + Gerenciar */}
        <div className="space-y-6 max-w-2xl mx-auto text-[15px] leading-relaxed">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">Calendário de estudos</h3>
              <Badge>{new Date().toLocaleString('pt-BR', { month: 'short' })}</Badge>
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs text-slate-500 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => <div key={d} className="text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((d) => (
                <div
                  key={d.key}
                  className={[
                    'h-9 rounded-lg border flex items-center justify-center text-sm',
                    d.day ? 'border-slate-200' : 'border-transparent',
                    d.isToday ? 'bg-blue-50 border-blue-200' : 'bg-white',
                    d.studied > 0 ? 'ring-1 ring-emerald-200' : '',
                  ].join(' ')}
                  title={d.day ? `${d.day}: ${d.studied} cards` : ''}
                >
                  {d.day ? (
                    <div className="flex flex-col items-center leading-tight">
                      <span className="font-semibold text-slate-700">{d.day}</span>
                      {d.studied > 0 && <span className="text-[10px] text-emerald-600 font-semibold">{d.studied}</span>}
                    </div>
                  ) : (
                    <span />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900">Notificações</h3>
              <Badge>{metrics.dueNow} para hoje</Badge>
            </div>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>• Use <b>Cards para hoje</b> para manter sua revisão em dia.</li>
              <li>• No <b>Treino livre</b>, você reforça pontos fracos com mais repetição.</li>
              <li>• Se estiver sem decks, fale com o admin para liberar conteúdos.</li>
            </ul>
          </div>

          {mode === 'manage' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900">Gerenciar</h3>
                <Badge>Admin</Badge>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-semibold text-slate-800 mb-2">Criar novo deck</div>
                  <input value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} placeholder="Nome do deck" className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white" />
                  <input value={newDeckTags} onChange={(e) => setNewDeckTags(e.target.value)} placeholder="Tags (separadas por vírgula)" className="mt-2 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white" />
                  <button onClick={createDeck} className="mt-3 w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Criar deck</button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="font-semibold text-slate-800 mb-2">Adicionar cards</div>
                  <select
                    value={selectedManageDeck?.id || ''}
                    onChange={(e) => setSelectedManageDeck(decks.find((d) => d.id === e.target.value) || null)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="">Selecione o deck</option>
                    {decks.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>

                  <textarea value={newCardFront} onChange={(e) => setNewCardFront(e.target.value)} placeholder="Frente (pergunta)" className="mt-2 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white min-h-[70px]" />
                  <textarea value={newCardBack} onChange={(e) => setNewCardBack(e.target.value)} placeholder="Verso (resposta)" className="mt-2 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white min-h-[70px]" />
                  <input value={newCardTags} onChange={(e) => setNewCardTags(e.target.value)} placeholder="Tags (opcional)" className="mt-2 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white" />
                  <button onClick={addCardToDeck} className="mt-3 w-full px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Adicionar card</button>

                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="font-semibold text-slate-800 mb-2">Importar CSV</div>
                    <div className="text-xs text-slate-500 mb-2">Formato: <b>frente;verso;tags</b> (tags por vírgula). 1 card por linha.</div>
                    <textarea value={bulkCsv} onChange={(e) => setBulkCsv(e.target.value)} placeholder="Ex.: Qual a tríade de Beck?;Hipotensão, turgência jugular, bulhas abafadas;cardio,emergência" className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white min-h-[120px]" />
                    <button onClick={importCsv} className="mt-3 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold hover:bg-slate-50">Importar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
      {/* Modal: Filtros de assuntos */}
      <Modal open={showFilters} title="Filtros de assuntos" onClose={() => setShowFilters(false)}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const all = new Set(decks.map(d => d.name));
                setSelectedSubjects(all);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Selecionar todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedSubjects(new Set())}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Desmarcar todos
            </button>

            <label className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>Ver estatísticas</span>
              <input
                type="checkbox"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600"
              />
            </label>
          </div>

          <div className="relative">
            <input
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
              placeholder="Buscar assuntos..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          </div>

          <div className="max-h-[40vh] overflow-y-auto rounded-xl border border-slate-200">
            {decks
              .filter(d => normalizeText(d.name).includes(normalizeText(subjectSearch)))
              .map((d) => {
                const checked = selectedSubjects.has(d.name);
                return (
                  <label key={d.id} className="flex items-center justify-between gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setSelectedSubjects(prev => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(d.name);
                            else next.delete(d.name);
                            return next;
                          });
                        }}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                      <span className="font-semibold text-slate-900">{d.name}</span>
                    </div>

                    {showStats ? (
                      <span className="text-xs font-semibold text-slate-500">—</span>
                    ) : (
                      <span />
                    )}
                  </label>
                );
              })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="font-bold text-slate-900 mb-3">Excluir</div>
              <label className="flex items-center gap-3 text-slate-700">
                <input type="checkbox" checked={excludeSeen} onChange={(e)=>setExcludeSeen(e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600" />
                <span>Vistos</span>
              </label>
              <label className="mt-2 flex items-center gap-3 text-slate-700">
                <input type="checkbox" checked={excludeMastered} onChange={(e)=>setExcludeMastered(e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600" />
                <span>Dominados</span>
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="font-bold text-slate-900 mb-3">Dificuldade</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { k: '1', label: 'Errei' },
                  { k: '2', label: 'Difícil' },
                  { k: '3', label: 'Moderado' },
                  { k: '4', label: 'Fácil' },
                ].map((x) => (
                  <button
                    key={x.k}
                    type="button"
                    onClick={() => setDifficultyFilter(x.k)}
                    className={"rounded-xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 " + (difficultyFilter === x.k ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")}
                  >
                    {x.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setDifficultyFilter('all')}
                  className={"rounded-xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 " + (difficultyFilter === 'all' ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")}
                >
                  Todos
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowFilters(false);
                loadQueue(mode);
              }}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Aplicar filtros
            </button>
            <button
              type="button"
              onClick={() => {
                setSubjectSearch('');
                setSelectedSubjects(new Set());
                setExcludeSeen(false);
                setExcludeMastered(false);
                setDifficultyFilter('all');
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Redefinir
            </button>
          </div>
        </div>
      </Modal>

<Modal open={showTutorial} title="Tutorial de Flashcards" onClose={() => setShowTutorial(false)}>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">O que é Revisão Espaçada?</h4>
            <p className="text-slate-700">
              A cada flashcard, você avalia o quanto sabe daquele assunto. Essa avaliação agenda automaticamente a próxima revisão
              no momento ideal para fixar de verdade.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50"><b>1 · Errei</b><div className="text-sm text-slate-600">Desconhecia a resposta e o tema.</div></div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50"><b>2 · Difícil</b><div className="text-sm text-slate-600">Conhecia o tema, mas errei.</div></div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50"><b>3 · Médio</b><div className="text-sm text-slate-600">Acertei, porém com dificuldade.</div></div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50"><b>4 · Fácil</b><div className="text-sm text-slate-600">Acertei de imediato.</div></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Comandos de teclado</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div className="p-4 rounded-xl border border-slate-200 bg-white"><b>Espaço / Enter</b><div className="text-sm text-slate-600">Mostra/oculta a resposta.</div></div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white"><b>← / →</b><div className="text-sm text-slate-600">Voltar ou avançar no deck.</div></div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white"><b>1 · 2 · 3 · 4</b><div className="text-sm text-slate-600">Errei, Difícil, Médio, Fácil.</div></div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white"><b>Clique no card</b><div className="text-sm text-slate-600">Também vira o flashcard.</div></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Modo de aprendizado</h4>
            <p className="text-slate-700">
              <b>Cards para hoje</b> prioriza o que está vencido. <b>Treino livre</b> serve para reforço (mistura e embaralha).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Filtros de assuntos</h4>
            <p className="text-slate-700">
              Use a busca para filtrar por tema, tags ou texto do card. Selecione um deck específico para foco total.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState('aluno');

  const [coursesData, setCoursesData] = useState(courses);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Load user data + role and log access
  useEffect(() => {
    const run = async () => {
      if (!authUser) {
        setUserData(null);
        setUserRole('aluno');
        return;
      }

      // Se não verificado, não carrega doc ainda (evita logs/leituras)
      if (!authUser.emailVerified) return;

      const ref = doc(db, 'users', authUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        const defaultUserData = {
          name: authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'Usuário'),
          email: authUser.email || '',
          phone: '',
          cpf: '',
          birthdate: '',
          address: '',
          bio: '',
          image: '',
          favorites: [],
          role: 'aluno',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(ref, defaultUserData);
        setUserData(defaultUserData);
        setUserRole('aluno');
      } else {
        const d = snap.data();
        setUserData(d);
        setUserRole(d?.role || 'aluno');
      }

      // access log
      try {
        await addDoc(collection(db, 'users', authUser.uid, 'accessLogs'), {
          ts: serverTimestamp(),
          userAgent: navigator.userAgent,
        });
      } catch {
        // silencioso
      }
    };
    run();
  }, [authUser]);

  // Courses: tenta puxar do Firestore (opcional). Faz fetch (sem listener) para evitar bug de watch stream em dev.
  useEffect(() => {
    if (!authReady) return;
    if (!authUser || !authUser.emailVerified) return;

    let cancelled = false;

    (async () => {
      try {
        const snap = await getDocs(collection(db, 'courses'));
        if (cancelled) return;
        const list = [];
        snap.forEach((docu) => list.push({ id: docu.id, ...docu.data() }));
        if (list.length) setCoursesData(list);
      } catch (e) {
        // fallback silencioso (ex.: permission-denied). Mantém o array local.
        console.warn('Não foi possível carregar cursos do Firestore (usando fallback local).', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, authUser]);

  return (
    <ErrorBoundary>
      <style>{BaseCSS}</style>
      <BrowserRouter>
        <Routes>
          {/* Página pública (homepage) */}
          <Route path="/" element={<PublicHomePage />} />

          {/* Login público */}
          <Route path="/entrar" element={<LoginPage />} />
          {/* Compatibilidade: rota antiga */}
          <Route path="/login" element={<Navigate to="/entrar" replace />} />

          <Route path="/verifique-email" element={<VerifyEmailPage authUser={authUser} />} />

          {/* Páginas institucionais externas */}
          <Route path="/privacidade" element={<ExternalRedirect to={`${INSTITUTIONAL_BASE}/politicaPrivacidade.html`} />} />
          <Route path="/termos" element={<ExternalRedirect to={`${INSTITUTIONAL_BASE}/termosUso.html`} />} />
          <Route path="/suporte" element={<ExternalRedirect to={`${INSTITUTIONAL_BASE}/suporte.html`} />} />
          <Route path="/cookies" element={<ExternalRedirect to={`${INSTITUTIONAL_BASE}/cookies.html`} />} />

          {/* Área logada */}
          <Route
            path="/app"
            element={
              <PrivateRoute authReady={authReady} authUser={authUser}>
                <Dashboard
                  authUser={authUser}
                  userData={userData || { name: authUser?.displayName || '', email: authUser?.email || '', image: '', favorites: [], role: userRole }}
                  setUserData={setUserData}
                  userRole={userRole}
                  courses={coursesData}
                />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/entrar" replace />} />
        </Routes>>
      </BrowserRouter>
    </ErrorBoundary>
  );
}