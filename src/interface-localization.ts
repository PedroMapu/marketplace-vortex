export {};

type CodigoIdioma = "pt-BR" | "de" | "en" | "fr" | "es" | "ja" | "zh-CN";

type FraseLocalizada = readonly [
  portugues: string,
  alemao: string,
  ingles: string,
  frances: string,
  espanhol: string,
  japones: string,
  chines: string,
];

const IDIOMAS: readonly CodigoIdioma[] = ["pt-BR", "de", "en", "fr", "es", "ja", "zh-CN"];
const CHAVE_IDIOMA = "marketplace-vortex-language";
const ATRIBUTOS_TRADUZIVEIS = ["aria-label", "placeholder", "title"] as const;
const ELEMENTOS_IGNORADOS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

const FRASES: readonly FraseLocalizada[] = [
  ["Marketplace Vortex | Economia Circular", "Marketplace Vortex | Kreislaufwirtschaft", "Marketplace Vortex | Circular Economy", "Marketplace Vortex | Économie circulaire", "Marketplace Vortex | Economía circular", "Marketplace Vortex | サーキュラーエコノミー", "Marketplace Vortex | 循环经济"],
  ["Marketplace Vortex - ir para o início", "Marketplace Vortex – zur Startseite", "Marketplace Vortex — go to home", "Marketplace Vortex — aller à l'accueil", "Marketplace Vortex — ir al inicio", "Marketplace Vortex — ホームへ", "Marketplace Vortex — 返回首页"],
  ["Abrir menu principal", "Hauptmenü öffnen", "Open main menu", "Ouvrir le menu principal", "Abrir menú principal", "メインメニューを開く", "打开主菜单"],
  ["Navegação principal", "Hauptnavigation", "Main navigation", "Navigation principale", "Navegación principal", "メインナビゲーション", "主导航"],
  ["Abrir notificações de conversas", "Unterhaltungsbenachrichtigungen öffnen", "Open conversation notifications", "Ouvrir les notifications de conversations", "Abrir notificaciones de conversaciones", "会話の通知を開く", "打开会话通知"],
  ["Mensagens", "Nachrichten", "Messages", "Messages", "Mensajes", "メッセージ", "消息"],
  ["Não lidas", "Ungelesen", "Unread", "Non lus", "No leídos", "未読", "未读"],
  ["Conversas não lidas", "Ungelesene Unterhaltungen", "Unread conversations", "Conversations non lues", "Conversaciones no leídas", "未読の会話", "未读会话"],
  ["Entrar na conta", "Anmelden", "Sign in", "Se connecter", "Iniciar sesión", "ログイン", "登录"],
  ["Voltar ao início", "Zurück zur Startseite", "Back to home", "Retour à l'accueil", "Volver al inicio", "ホームに戻る", "返回首页"],
  ["Ações principais", "Hauptaktionen", "Main actions", "Actions principales", "Acciones principales", "主な操作", "主要操作"],
  ["Destaque da plataforma", "Plattform-Highlight", "Platform highlight", "À la une sur la plateforme", "Destacado de la plataforma", "プラットフォームの注目情報", "平台亮点"],
  ["Objetos em movimento.\nImpacto que continua.", "Dinge in Bewegung.\nWirkung, die bleibt.", "Items in motion.\nImpact that continues.", "Des objets en mouvement.\nUn impact qui se poursuit.", "Objetos en movimiento.\nUn impacto que continúa.", "モノを循環させ、\nインパクトを未来へ。", "物品持续流转，\n影响不断延续。"],
  ["Em vez de descartar, faça circular.", "Weitergeben statt wegwerfen.", "Keep it circulating instead of throwing it away.", "Faites circuler au lieu de jeter.", "Haz que circule en vez de desecharlo.", "捨てずに、循環させよう。", "与其丢弃，不如让它流转。"],
  ["EM MOVIMENTO", "IN BEWEGUNG", "IN MOTION", "EN MOUVEMENT", "EN MOVIMIENTO", "循環中", "流转中"],
  ["Desapegue", "Weitergeben", "Let go", "Faites le tri", "Déjalo ir", "手放す", "闲置转手"],
  ["Cadastre um item que você não usa mais, para venda ou doação.", "Stelle einen ungenutzten Artikel zum Verkauf oder Verschenken ein.", "List an item you no longer use for sale or donation.", "Publiez un objet que vous n'utilisez plus, à vendre ou à donner.", "Publica un artículo que ya no uses para venderlo o donarlo.", "使わなくなった品物を販売または寄付として出品します。", "发布不再使用的物品，用于出售或捐赠。"],
  ["Conecte", "Vernetzen", "Connect", "Connectez-vous", "Conecta", "つながる", "建立联系"],
  ["Seu anúncio fica disponível para pessoas da comunidade.", "Deine Anzeige wird für Mitglieder der Community sichtbar.", "Your listing becomes available to people in the community.", "Votre annonce devient visible par les membres de la communauté.", "Tu anuncio queda disponible para la comunidad.", "出品がコミュニティの人々に公開されます。", "你的发布将对社区成员可见。"],
  ["Reutilize", "Wiederverwenden", "Reuse", "Réutilisez", "Reutiliza", "再利用する", "重复利用"],
  ["Outro item encontra um novo propósito em vez de virar resíduo.", "Ein weiterer Artikel findet einen neuen Zweck, statt zu Abfall zu werden.", "Another item finds a new purpose instead of becoming waste.", "Un objet trouve une nouvelle utilité au lieu de devenir un déchet.", "Otro artículo encuentra un nuevo propósito en vez de convertirse en residuo.", "品物が廃棄物にならず、新しい役割を見つけます。", "物品找到新的用途，而不是成为废弃物。"],
  ["Transforme", "Verändern", "Transform", "Transformez", "Transforma", "変える", "带来改变"],
  ["Pequenas escolhas ajudam a criar um campus mais consciente.", "Kleine Entscheidungen tragen zu einem bewussteren Campus bei.", "Small choices help create a more conscious campus.", "De petits choix contribuent à un campus plus responsable.", "Las pequeñas decisiones ayudan a crear un campus más consciente.", "小さな選択が、より意識の高いキャンパスをつくります。", "小小的选择有助于建设更有责任感的校园。"],
  ["Cada anúncio mantém recursos em movimento.", "Jede Anzeige hält Ressourcen im Umlauf.", "Every listing keeps resources in motion.", "Chaque annonce maintient les ressources en circulation.", "Cada anuncio mantiene los recursos en movimiento.", "一つひとつの出品が資源を循環させます。", "每条发布都让资源继续流转。"],
  ["Itens reaproveitados", "Wiederverwendete Artikel", "Items reused", "Objets réutilisés", "Artículos reutilizados", "再利用された品物", "已重复利用的物品"],
  ["Quilos de resíduos evitados", "Vermiedene Kilogramm Abfall", "Kilograms of waste avoided", "Kilogrammes de déchets évités", "Kilogramos de residuos evitados", "削減できた廃棄物（kg）", "减少的废弃物（千克）"],
  ["Anúncios ativos", "Aktive Anzeigen", "Active listings", "Annonces actives", "Anuncios activos", "公開中の出品", "有效发布"],
  ["Pessoas conectadas", "Vernetzte Personen", "People connected", "Personnes connectées", "Personas conectadas", "つながった人々", "已连接的人数"],
  ["Dados demonstrativos para esta primeira versão.", "Demonstrationsdaten für diese erste Version.", "Demo data for this first version.", "Données de démonstration pour cette première version.", "Datos de demostración para esta primera versión.", "初期バージョン用のデモデータです。", "此初始版本使用演示数据。"],
  ["Filtros do catálogo", "Katalogfilter", "Catalog filters", "Filtres du catalogue", "Filtros del catálogo", "カタログの絞り込み", "目录筛选"],
  ["Categoria, preço, condição e modalidade", "Kategorie, Preis, Zustand und Art", "Category, price, condition, and listing type", "Catégorie, prix, état et modalité", "Categoría, precio, estado y modalidad", "カテゴリー、価格、状態、取引方法", "类别、价格、状况和方式"],
  ["Filtros laterais de busca", "Seitliche Suchfilter", "Side search filters", "Filtres de recherche latéraux", "Filtros laterales de búsqueda", "サイド検索フィルター", "侧边搜索筛选"],
  ["Categorias", "Kategorien", "Categories", "Catégories", "Categorías", "カテゴリー", "类别"],
  ["Todas as Categorias", "Alle Kategorien", "All categories", "Toutes les catégories", "Todas las categorías", "すべてのカテゴリー", "所有类别"],
  ["Livros e Papelaria", "Bücher und Schreibwaren", "Books and stationery", "Livres et papeterie", "Libros y papelería", "書籍・文房具", "书籍和文具"],
  ["Eletrônicos", "Elektronik", "Electronics", "Électronique", "Electrónica", "電子機器", "电子产品"],
  ["Casa e Decoração", "Wohnen und Dekoration", "Home and decor", "Maison et décoration", "Hogar y decoración", "住まい・インテリア", "家居和装饰"],
  ["Moda e Acessórios", "Mode und Accessoires", "Fashion and accessories", "Mode et accessoires", "Moda y accesorios", "ファッション・アクセサリー", "时尚和配饰"],
  ["Outros", "Sonstiges", "Other", "Autres", "Otros", "その他", "其他"],
  ["Faixa de Valor", "Preisspanne", "Price range", "Fourchette de prix", "Rango de precio", "価格帯", "价格范围"],
  ["De R$", "Ab R$", "From R$", "De R$", "Desde R$", "最低 R$", "最低 R$"],
  ["Até R$", "Bis R$", "Up to R$", "Jusqu'à R$", "Hasta R$", "最高 R$", "最高 R$"],
  ["Valor mínimo", "Mindestpreis", "Minimum price", "Prix minimum", "Precio mínimo", "最低価格", "最低价格"],
  ["Valor máximo", "Höchstpreis", "Maximum price", "Prix maximum", "Precio máximo", "最高価格", "最高价格"],
  ["Aplicar filtro de preço", "Preisfilter anwenden", "Apply price filter", "Appliquer le filtre de prix", "Aplicar filtro de precio", "価格フィルターを適用", "应用价格筛选"],
  ["Condição", "Zustand", "Condition", "État", "Estado", "状態", "状况"],
  ["Todas as condições", "Alle Zustände", "All conditions", "Tous les états", "Todos los estados", "すべての状態", "所有状况"],
  ["Novo", "Neu", "New", "Neuf", "Nuevo", "新品", "全新"],
  ["Seminovo", "Neuwertig", "Like new", "Comme neuf", "Seminuevo", "ほぼ新品", "几乎全新"],
  ["Usado", "Gebraucht", "Used", "D'occasion", "Usado", "中古", "二手"],
  ["Modalidade", "Angebotsart", "Listing type", "Modalité", "Modalidad", "取引方法", "发布方式"],
  ["Todas", "Alle", "All", "Toutes", "Todas", "すべて", "全部"],
  ["Venda", "Verkauf", "Sale", "Vente", "Venta", "販売", "出售"],
  ["Doação", "Zu verschenken", "Donation", "Don", "Donación", "寄付", "捐赠"],
  ["Modo de visualização", "Ansichtsmodus", "View mode", "Mode d'affichage", "Modo de visualización", "表示モード", "视图模式"],
  ["Visualização em grade", "Rasteransicht", "Grid view", "Vue en grille", "Vista en cuadrícula", "グリッド表示", "网格视图"],
  ["Visualização em lista", "Listenansicht", "List view", "Vue en liste", "Vista en lista", "リスト表示", "列表视图"],
  ["Ações da vitrine", "Katalogaktionen", "Catalog actions", "Actions du catalogue", "Acciones del catálogo", "カタログの操作", "目录操作"],
  ["Seu item, uma nova história", "Dein Artikel, eine neue Geschichte", "Your item, a new story", "Votre objet, une nouvelle histoire", "Tu artículo, una nueva historia", "あなたの品物に、新しい物語を", "让你的物品开启新故事"],
  ["Publique um anúncio", "Anzeige veröffentlichen", "Publish a listing", "Publier une annonce", "Publicar un anuncio", "出品を公開", "发布物品"],
  ["Fechar formulário de anúncio", "Anzeigenformular schließen", "Close listing form", "Fermer le formulaire d'annonce", "Cerrar formulario de anuncio", "出品フォームを閉じる", "关闭发布表单"],
  ["Todos os campos são obrigatórios. Preencha as informações para disponibilizar seu item na comunidade.", "Alle Felder sind Pflichtfelder. Fülle die Angaben aus, um deinen Artikel in der Community anzubieten.", "All fields are required. Complete the details to make your item available to the community.", "Tous les champs sont obligatoires. Renseignez les informations pour proposer votre objet à la communauté.", "Todos los campos son obligatorios. Completa la información para ofrecer tu artículo a la comunidad.", "すべて必須項目です。コミュニティに品物を公開するため、情報を入力してください。", "所有字段均为必填项。请填写信息，将物品发布到社区。"],
  ["Nome do item", "Artikelname", "Item name", "Nom de l'objet", "Nombre del artículo", "品物名", "物品名称"],
  ["Ex.: Calculadora científica", "Z. B. Wissenschaftlicher Taschenrechner", "E.g., scientific calculator", "Ex. : calculatrice scientifique", "Ej.: calculadora científica", "例：関数電卓", "例如：科学计算器"],
  ["Categoria", "Kategorie", "Category", "Catégorie", "Categoría", "カテゴリー", "类别"],
  ["Selecione uma categoria", "Kategorie auswählen", "Select a category", "Sélectionnez une catégorie", "Selecciona una categoría", "カテゴリーを選択", "选择类别"],
  ["Livros e papelaria", "Bücher und Schreibwaren", "Books and stationery", "Livres et papeterie", "Libros y papelería", "書籍・文房具", "书籍和文具"],
  ["Casa e decoração", "Wohnen und Dekoration", "Home and decor", "Maison et décoration", "Hogar y decoración", "住まい・インテリア", "家居和装饰"],
  ["Moda e acessórios", "Mode und Accessoires", "Fashion and accessories", "Mode et accessoires", "Moda y accesorios", "ファッション・アクセサリー", "时尚和配饰"],
  ["Selecione a condição", "Zustand auswählen", "Select the condition", "Sélectionnez l'état", "Selecciona el estado", "状態を選択", "选择物品状况"],
  ["Valor", "Preis", "Price", "Prix", "Precio", "価格", "价格"],
  ["Em anúncios de doação, o valor será definido como R$ 0,00.", "Bei Spenden wird der Preis auf R$ 0,00 gesetzt.", "Donation listings are automatically set to R$ 0.00.", "Pour les dons, le prix est automatiquement fixé à 0,00 R$.", "En los anuncios de donación, el valor será de R$ 0,00.", "寄付の場合、価格は R$ 0.00 に設定されます。", "捐赠发布的价格将设为 R$ 0.00。"],
  ["Localização para retirada", "Abholort", "Pickup location", "Lieu de retrait", "Lugar de recogida", "受け取り場所", "取货地点"],
  ["Ex.: Bloco Q, Centro de Convivência", "Z. B. Block Q, Gemeinschaftszentrum", "E.g., Block Q, Student Center", "Ex. : bâtiment Q, centre de vie étudiante", "Ej.: Bloque Q, Centro de Convivencia", "例：Q棟、交流センター", "例如：Q 楼，学生活动中心"],
  ["Imagem do item", "Artikelbild", "Item image", "Image de l'objet", "Imagen del artículo", "品物の画像", "物品图片"],
  ["Formatos aceitos: PNG, JPG e JPEG.", "Akzeptierte Formate: PNG, JPG und JPEG.", "Accepted formats: PNG, JPG, and JPEG.", "Formats acceptés : PNG, JPG et JPEG.", "Formatos aceptados: PNG, JPG y JPEG.", "対応形式：PNG、JPG、JPEG。", "支持格式：PNG、JPG 和 JPEG。"],
  ["Tamanho ideal: 1200 x 900 px (4:3).", "Ideale Größe: 1200 × 900 px (4:3).", "Ideal size: 1200 × 900 px (4:3).", "Taille idéale : 1200 × 900 px (4:3).", "Tamaño ideal: 1200 × 900 px (4:3).", "推奨サイズ：1200 × 900 px（4:3）。", "建议尺寸：1200 × 900 px（4:3）。"],
  ["Arquivo de até 15 MB, otimizado automaticamente antes do envio.", "Datei bis 15 MB; sie wird vor dem Upload automatisch optimiert.", "Files up to 15 MB are automatically optimized before upload.", "Fichier de 15 Mo maximum, optimisé automatiquement avant l'envoi.", "Archivo de hasta 15 MB, optimizado automáticamente antes del envío.", "15 MB まで。送信前に自動で最適化されます。", "文件最大 15 MB，上传前会自动优化。"],
  ["Descrição", "Beschreibung", "Description", "Description", "Descripción", "説明", "描述"],
  ["Conte um pouco mais sobre o estado e a utilidade do item.", "Beschreibe Zustand und Nutzen des Artikels etwas genauer.", "Tell us more about the item's condition and usefulness.", "Décrivez plus précisément l'état et l'utilité de l'objet.", "Cuenta un poco más sobre el estado y la utilidad del artículo.", "品物の状態や用途について詳しく入力してください。", "请进一步说明物品的状况和用途。"],
  ["Vários itens, uma só curadoria", "Mehrere Artikel, eine Sammlung", "Several items, one curated collection", "Plusieurs objets, une seule sélection", "Varios artículos, una sola selección", "複数の品物を、一つのコレクションに", "多件物品，一个精选合集"],
  ["Crie uma coleção", "Sammlung erstellen", "Create a collection", "Créer une collection", "Crea una colección", "コレクションを作成", "创建合集"],
  ["Fechar formulário de coleção", "Sammlungsformular schließen", "Close collection form", "Fermer le formulaire de collection", "Cerrar formulario de colección", "コレクションフォームを閉じる", "关闭合集表单"],
  ["Escolha um nome para a coleção e adicione todos os itens que fazem parte dela.", "Gib der Sammlung einen Namen und füge alle zugehörigen Artikel hinzu.", "Choose a name for the collection and add all the items it includes.", "Choisissez un nom pour la collection et ajoutez tous les objets qui la composent.", "Elige un nombre para la colección y añade todos los artículos que la componen.", "コレクション名を決め、含める品物をすべて追加してください。", "为合集命名，并添加其中包含的所有物品。"],
  ["Nome da coleção", "Name der Sammlung", "Collection name", "Nom de la collection", "Nombre de la colección", "コレクション名", "合集名称"],
  ["Ex.: Materiais para o primeiro semestre", "Z. B. Materialien fürs erste Semester", "E.g., first-semester supplies", "Ex. : matériel pour le premier semestre", "Ej.: materiales para el primer semestre", "例：1学期用の教材", "例如：第一学期用品"],
  ["Itens da coleção", "Artikel der Sammlung", "Collection items", "Objets de la collection", "Artículos de la colección", "コレクションの品物", "合集物品"],
  ["Adicione ao menos um item. Cada item precisa de nome e categoria.", "Füge mindestens einen Artikel hinzu. Jeder Artikel benötigt einen Namen und eine Kategorie.", "Add at least one item. Each item needs a name and category.", "Ajoutez au moins un objet. Chaque objet doit avoir un nom et une catégorie.", "Añade al menos un artículo. Cada artículo necesita nombre y categoría.", "少なくとも1点追加してください。各品物には名前とカテゴリーが必要です。", "请至少添加一件物品。每件物品都需要名称和类别。"],
  ["Filtrar catálogo", "Katalog filtern", "Filter catalog", "Filtrer le catalogue", "Filtrar catálogo", "カタログを絞り込む", "筛选目录"],
  ["Todos", "Alle", "All", "Tous", "Todos", "すべて", "全部"],
  ["Itens recentes", "Neue Artikel", "Recent items", "Objets récents", "Artículos recientes", "新着", "最新物品"],
  ["À venda", "Zum Verkauf", "For sale", "À vendre", "En venta", "販売中", "出售中"],
  ["Doações", "Spenden", "Donations", "Dons", "Donaciones", "寄付", "捐赠"],
  ["Seu alcance no marketplace", "Deine Reichweite im Marketplace", "Your marketplace reach", "Votre portée sur la marketplace", "Tu alcance en el marketplace", "マーケットプレイスでの反響", "你在市场中的影响力"],
  ["Fechar meus anúncios", "Meine Anzeigen schließen", "Close my listings", "Fermer mes annonces", "Cerrar mis anuncios", "自分の出品を閉じる", "关闭我的发布"],
  ["Anúncios publicados por você", "Von dir veröffentlichte Anzeigen", "Listings published by you", "Annonces que vous avez publiées", "Anuncios publicados por ti", "あなたが公開した出品", "你发布的物品"],
  ["Anúncios disponíveis", "Verfügbare Anzeigen", "Available listings", "Annonces disponibles", "Anuncios disponibles", "公開中の出品", "可用发布"],
  ["Curadoria da comunidade", "Auswahl der Community", "Community picks", "Sélection de la communauté", "Selección de la comunidad", "コミュニティのおすすめ", "社区精选"],
  ["Coleções recomendadas", "Empfohlene Sammlungen", "Recommended collections", "Collections recommandées", "Colecciones recomendadas", "おすすめコレクション", "推荐合集"],
  ["Conjuntos de itens úteis agrupados por alunos da UNIFOR.", "Nützliche Artikel, zusammengestellt von UNIFOR-Studierenden.", "Useful item collections curated by UNIFOR students.", "Des ensembles d'objets utiles regroupés par des étudiants de l'UNIFOR.", "Conjuntos de artículos útiles agrupados por estudiantes de UNIFOR.", "UNIFORの学生がまとめた便利な品物のコレクションです。", "由 UNIFOR 学生整理的实用物品合集。"],
  ["Doadores em Destaque", "Top-Spender", "Featured donors", "Donateurs à l'honneur", "Donantes destacados", "注目の寄付者", "优秀捐赠者"],
  ["Alunos e professores que mais movimentam e doam itens no campus.", "Studierende und Lehrende, die auf dem Campus besonders viele Artikel weitergeben und spenden.", "Students and faculty who circulate and donate the most items on campus.", "Les étudiants et enseignants qui font le plus circuler et donnent des objets sur le campus.", "Estudiantes y profesores que más artículos mueven y donan en el campus.", "キャンパスで特に多くの品物を循環・寄付している学生と教職員です。", "在校园内流转和捐赠物品最多的学生与教师。"],
  ["Navegação do rodapé - Coluna 1", "Fußzeilennavigation – Spalte 1", "Footer navigation — column 1", "Navigation du pied de page — colonne 1", "Navegación del pie — columna 1", "フッターナビゲーション — 1列目", "页脚导航 — 第 1 列"],
  ["Navegação do rodapé - Coluna 2", "Fußzeilennavigation – Spalte 2", "Footer navigation — column 2", "Navigation du pied de page — colonne 2", "Navegación del pie — columna 2", "フッターナビゲーション — 2列目", "页脚导航 — 第 2 列"],
  ["Informações legais", "Rechtliche Informationen", "Legal information", "Informations légales", "Información legal", "法的情報", "法律信息"],
  ["Termos de uso", "Nutzungsbedingungen", "Terms of use", "Conditions d'utilisation", "Términos de uso", "利用規約", "使用条款"],
  ["Privacidade", "Datenschutz", "Privacy", "Confidentialité", "Privacidad", "プライバシー", "隐私"],
  ["© 2026 Marketplace Vortex. Todos os direitos reservados (Feito por", "© 2026 Marketplace Vortex. Alle Rechte vorbehalten (Erstellt von", "© 2026 Marketplace Vortex. All rights reserved (Created by", "© 2026 Marketplace Vortex. Tous droits réservés (Créé par", "© 2026 Marketplace Vortex. Todos los derechos reservados (Creado por", "© 2026 Marketplace Vortex. All rights reserved（制作：", "© 2026 Marketplace Vortex。保留所有权利（制作："],
  ["Uma conta.\nMais voltas.", "Ein Konto.\nMehr Kreisläufe.", "One account.\nMore cycles.", "Un compte.\nPlus de cycles.", "Una cuenta.\nMás vueltas.", "一つのアカウントで、\nもっと循環を。", "一个账户，\n更多循环。"],
  ["Publique, doe e acompanhe seus anúncios.", "Veröffentliche, verschenke und verwalte deine Anzeigen.", "Publish, donate, and track your listings.", "Publiez, donnez et suivez vos annonces.", "Publica, dona y sigue tus anuncios.", "出品、寄付、管理を一つの場所で。", "发布、捐赠并跟踪你的物品。"],
  ["Fechar acesso à conta", "Anmeldung schließen", "Close account access", "Fermer l'accès au compte", "Cerrar acceso a la cuenta", "アカウント画面を閉じる", "关闭账户访问"],
  ["Conta Vortex", "Vortex-Konto", "Vortex account", "Compte Vortex", "Cuenta Vortex", "Vortex アカウント", "Vortex 账户"],
  ["Entre para continuar o ciclo.", "Melde dich an, um den Kreislauf fortzusetzen.", "Sign in to keep the cycle going.", "Connectez-vous pour poursuivre le cycle.", "Inicia sesión para continuar el ciclo.", "ログインして循環を続けましょう。", "登录以继续循环。"],
  ["Acesso à conta", "Kontozugang", "Account access", "Accès au compte", "Acceso a la cuenta", "アカウントへのアクセス", "账户访问"],
  ["E-mail", "E-Mail", "Email", "E-mail", "Correo electrónico", "メールアドレス", "电子邮箱"],
  ["Senha", "Passwort", "Password", "Mot de passe", "Contraseña", "パスワード", "密码"],
  ["Manter conectado", "Angemeldet bleiben", "Keep me signed in", "Rester connecté", "Mantener la sesión iniciada", "ログイン状態を保持", "保持登录"],
  ["Nome", "Name", "Name", "Nom", "Nombre", "名前", "姓名"],
  ["Confirmar senha", "Passwort bestätigen", "Confirm password", "Confirmer le mot de passe", "Confirmar contraseña", "パスワードを確認", "确认密码"],
  ["Fechar janela da minha conta", "Kontofenster schließen", "Close my account window", "Fermer la fenêtre de mon compte", "Cerrar ventana de mi cuenta", "マイアカウント画面を閉じる", "关闭我的账户窗口"],
  ["Minha conta", "Mein Konto", "My account", "Mon compte", "Mi cuenta", "マイアカウント", "我的账户"],
  ["Alterar foto", "Foto ändern", "Change photo", "Changer la photo", "Cambiar foto", "写真を変更", "更换照片"],
  ["Sair da conta", "Abmelden", "Sign out", "Se déconnecter", "Cerrar sesión", "ログアウト", "退出登录"],
  ["Concluir anúncio", "Anzeige abschließen", "Complete listing", "Finaliser l'annonce", "Finalizar anuncio", "出品を完了", "完成发布"],
  ["Cancelar", "Abbrechen", "Cancel", "Annuler", "Cancelar", "キャンセル", "取消"],
  ["Atualize o ciclo do item", "Aktualisiere den Artikelkreislauf", "Update the item's cycle", "Mettez à jour le cycle de l'objet", "Actualiza el ciclo del artículo", "品物の循環状況を更新", "更新物品流转状态"],
  ["Editar anúncio", "Anzeige bearbeiten", "Edit listing", "Modifier l'annonce", "Editar anuncio", "出品を編集", "编辑发布"],
  ["Fechar edição do anúncio", "Anzeigenbearbeitung schließen", "Close listing editor", "Fermer la modification de l'annonce", "Cerrar edición del anuncio", "出品編集を閉じる", "关闭发布编辑"],
  ["Substituir imagem", "Bild ersetzen", "Replace image", "Remplacer l'image", "Reemplazar imagen", "画像を差し替える", "替换图片"],
  ["A imagem atual será mantida se você não escolher outra.", "Das aktuelle Bild bleibt erhalten, wenn du kein anderes auswählst.", "The current image will remain if you do not choose another one.", "L'image actuelle sera conservée si vous n'en choisissez pas une autre.", "La imagen actual se mantendrá si no eliges otra.", "別の画像を選ばない場合、現在の画像が保持されます。", "如果不选择其他图片，将保留当前图片。"],
  ["Salvar alterações", "Änderungen speichern", "Save changes", "Enregistrer les modifications", "Guardar cambios", "変更を保存", "保存更改"],
  ["Detalhes do item", "Artikeldetails", "Item details", "Détails de l'objet", "Detalles del artículo", "品物の詳細", "物品详情"],
  ["Fechar detalhes do anúncio", "Anzeigendetails schließen", "Close listing details", "Fermer les détails de l'annonce", "Cerrar detalles del anuncio", "出品の詳細を閉じる", "关闭发布详情"],
  ["Anunciante:", "Anbieter:", "Seller:", "Annonceur :", "Anunciante:", "出品者：", "发布者："],
  ["Negocie com segurança", "Sicher verhandeln", "Negotiate safely", "Négociez en toute sécurité", "Negocia con seguridad", "安全に交渉", "安全协商"],
  ["Ofertas e conversas", "Angebote und Unterhaltungen", "Offers and conversations", "Offres et conversations", "Ofertas y conversaciones", "オファーと会話", "报价与会话"],
  ["Fechar ofertas e conversas", "Angebote und Unterhaltungen schließen", "Close offers and conversations", "Fermer les offres et conversations", "Cerrar ofertas y conversaciones", "オファーと会話を閉じる", "关闭报价与会话"],
  ["Suas conversas", "Deine Unterhaltungen", "Your conversations", "Vos conversations", "Tus conversaciones", "あなたの会話", "你的会话"],
  ["Entre na sua conta para ver as conversas.", "Melde dich an, um deine Unterhaltungen zu sehen.", "Sign in to view your conversations.", "Connectez-vous pour voir vos conversations.", "Inicia sesión para ver tus conversaciones.", "会話を見るにはログインしてください。", "登录以查看会话。"],
  ["Voltar para a lista de conversas", "Zurück zur Unterhaltungsliste", "Back to conversation list", "Retour à la liste des conversations", "Volver a la lista de conversaciones", "会話一覧に戻る", "返回会话列表"],
  ["Selecione uma conversa", "Unterhaltung auswählen", "Select a conversation", "Sélectionnez une conversation", "Selecciona una conversación", "会話を選択", "选择会话"],
  ["Chat da oferta", "Angebotschat", "Offer chat", "Discussion de l'offre", "Chat de la oferta", "オファーのチャット", "报价聊天"],
  ["Histórico da conversa", "Unterhaltungsverlauf", "Conversation history", "Historique de la conversation", "Historial de la conversación", "会話履歴", "会话记录"],
  ["Escolha um anúncio para fazer uma oferta ou abra uma conversa.", "Wähle eine Anzeige, um ein Angebot zu machen, oder öffne eine Unterhaltung.", "Choose a listing to make an offer, or open a conversation.", "Choisissez une annonce pour faire une offre ou ouvrez une conversation.", "Elige un anuncio para hacer una oferta o abre una conversación.", "オファーする出品を選ぶか、会話を開いてください。", "选择一条发布进行报价，或打开会话。"],
  ["Fazer oferta", "Angebot machen", "Make an offer", "Faire une offre", "Hacer una oferta", "オファーする", "提出报价"],
  ["Valor da oferta", "Angebotsbetrag", "Offer amount", "Montant de l'offre", "Valor de la oferta", "オファー金額", "报价金额"],
  ["Mensagem ao anunciante", "Nachricht an den Anbieter", "Message to the seller", "Message à l'annonceur", "Mensaje al anunciante", "出品者へのメッセージ", "给发布者的消息"],
  ["Apresente sua oferta e combine os próximos passos.", "Stelle dein Angebot vor und vereinbare die nächsten Schritte.", "Introduce your offer and agree on the next steps.", "Présentez votre offre et convenez des prochaines étapes.", "Presenta tu oferta y acuerda los próximos pasos.", "オファー内容を伝え、次の手順を相談しましょう。", "说明你的报价并商定后续步骤。"],
  ["Enviar oferta", "Angebot senden", "Send offer", "Envoyer l'offre", "Enviar oferta", "オファーを送信", "发送报价"],
  ["Enviar mensagem", "Nachricht senden", "Send message", "Envoyer le message", "Enviar mensaje", "メッセージを送信", "发送消息"],
  ["Mensagem", "Nachricht", "Message", "Message", "Mensaje", "メッセージ", "消息"],
  ["Escreva uma mensagem...", "Nachricht schreiben …", "Write a message...", "Écrivez un message…", "Escribe un mensaje...", "メッセージを入力…", "输入消息……"],
  ["Enviar", "Senden", "Send", "Envoyer", "Enviar", "送信", "发送"],
  ["Coleções deste navegador", "Sammlungen dieses Browsers", "Collections from this browser", "Collections de ce navigateur", "Colecciones de este navegador", "このブラウザのコレクション", "此浏览器中的合集"],
  ["Trazer suas coleções antigas?", "Alte Sammlungen übernehmen?", "Bring over your old collections?", "Importer vos anciennes collections ?", "¿Importar tus colecciones antiguas?", "以前のコレクションを引き継ぎますか？", "要导入旧合集吗？"],
  ["Quem está anunciando", "Wer bietet diesen Artikel an?", "Who is listing this item", "Qui publie cette annonce ?", "Quién publica el anuncio", "出品者", "发布者"],
  ["Foto do anunciante", "Foto des Anbieters", "Seller photo", "Photo de l'annonceur", "Foto del anunciante", "出品者の写真", "发布者照片"],
  ["Fechar imagem ampliada", "Vergrößertes Bild schließen", "Close enlarged image", "Fermer l'image agrandie", "Cerrar imagen ampliada", "拡大画像を閉じる", "关闭放大图片"],
  ["Pressione Esc ou clique fora da imagem para fechar.", "Drücke Esc oder klicke außerhalb des Bildes, um es zu schließen.", "Press Esc or click outside the image to close it.", "Appuyez sur Échap ou cliquez hors de l'image pour la fermer.", "Pulsa Esc o haz clic fuera de la imagen para cerrarla.", "Esc キーを押すか画像の外側をクリックして閉じます。", "按 Esc 或点击图片外部即可关闭。"],
  ["Pressione Esc ou clique fora desta janela para sair.", "Drücke Esc oder klicke außerhalb dieses Fensters, um es zu schließen.", "Press Esc or click outside this window to exit.", "Appuyez sur Échap ou cliquez hors de cette fenêtre pour quitter.", "Pulsa Esc o haz clic fuera de esta ventana para salir.", "Esc キーを押すかウィンドウの外側をクリックして終了します。", "按 Esc 或点击窗口外部即可退出。"],
  ["Sair", "Schließen", "Exit", "Quitter", "Salir", "閉じる", "退出"],
  ["Carregando anúncios...", "Anzeigen werden geladen …", "Loading listings...", "Chargement des annonces…", "Cargando anuncios...", "出品を読み込み中…", "正在加载发布……"],
  ["Carregando seus anúncios...", "Deine Anzeigen werden geladen …", "Loading your listings...", "Chargement de vos annonces…", "Cargando tus anuncios...", "あなたの出品を読み込み中…", "正在加载你的发布……"],
  ["Carregando resultados...", "Ergebnisse werden geladen …", "Loading results...", "Chargement des résultats…", "Cargando resultados...", "結果を読み込み中…", "正在加载结果……"],
  ["Anúncios indisponíveis", "Anzeigen nicht verfügbar", "Listings unavailable", "Annonces indisponibles", "Anuncios no disponibles", "出品を利用できません", "发布不可用"],
  ["Catálogo indisponível offline", "Katalog offline nicht verfügbar", "Catalog unavailable offline", "Catalogue indisponible hors ligne", "Catálogo no disponible sin conexión", "オフラインではカタログを利用できません", "离线时目录不可用"],
  ["Você está offline", "Du bist offline", "You are offline", "Vous êtes hors ligne", "Estás sin conexión", "オフラインです", "你当前离线"],
  ["Conexão restabelecida", "Verbindung wiederhergestellt", "Connection restored", "Connexion rétablie", "Conexión restablecida", "接続が復旧しました", "连接已恢复"],
  ["Não foi possível concluir a solicitação.", "Die Anfrage konnte nicht abgeschlossen werden.", "The request could not be completed.", "La demande n'a pas pu être effectuée.", "No se pudo completar la solicitud.", "リクエストを完了できませんでした。", "无法完成请求。"],
  ["Sua sessão expirou. Entre novamente para continuar.", "Deine Sitzung ist abgelaufen. Melde dich erneut an.", "Your session has expired. Sign in again to continue.", "Votre session a expiré. Reconnectez-vous pour continuer.", "Tu sesión ha caducado. Inicia sesión de nuevo para continuar.", "セッションの有効期限が切れました。もう一度ログインしてください。", "会话已过期。请重新登录以继续。"],
  ["Quando chegar uma mensagem, ela aparecerá aqui.", "Neue Nachrichten erscheinen hier.", "New messages will appear here.", "Les nouveaux messages apparaîtront ici.", "Los mensajes nuevos aparecerán aquí.", "新しいメッセージはここに表示されます。", "新消息将显示在这里。"],
  ["Você ainda não tem ofertas. Escolha um anúncio para começar.", "Du hast noch keine Angebote. Wähle eine Anzeige, um zu beginnen.", "You don't have any offers yet. Choose a listing to get started.", "Vous n'avez pas encore d'offres. Choisissez une annonce pour commencer.", "Aún no tienes ofertas. Elige un anuncio para comenzar.", "まだオファーがありません。出品を選んで始めましょう。", "你还没有报价。选择一条发布开始吧。"],
  ["Escolha uma conversa na lista para abrir o histórico.", "Wähle eine Unterhaltung aus der Liste, um den Verlauf zu öffnen.", "Choose a conversation from the list to open its history.", "Choisissez une conversation dans la liste pour ouvrir son historique.", "Elige una conversación de la lista para abrir el historial.", "一覧から会話を選んで履歴を開いてください。", "从列表中选择会话以打开记录。"],
  ["Quando você fizer ou receber uma oferta, a conversa aparecerá aqui.", "Wenn du ein Angebot machst oder erhältst, erscheint die Unterhaltung hier.", "When you make or receive an offer, the conversation will appear here.", "Lorsque vous ferez ou recevrez une offre, la conversation apparaîtra ici.", "Cuando hagas o recibas una oferta, la conversación aparecerá aquí.", "オファーを送受信すると、会話がここに表示されます。", "当你提出或收到报价时，会话将显示在这里。"],
  ["Oferta enviada. A conversa está aberta.", "Angebot gesendet. Die Unterhaltung ist geöffnet.", "Offer sent. The conversation is now open.", "Offre envoyée. La conversation est ouverte.", "Oferta enviada. La conversación está abierta.", "オファーを送信しました。会話を開きました。", "报价已发送。会话已打开。"],
  ["Ativo", "Aktiv", "Active", "Active", "Activo", "公開中", "有效"],
  ["Concluído", "Abgeschlossen", "Completed", "Terminée", "Finalizado", "完了", "已完成"],
  ["Grátis (Doação)", "Kostenlos (Spende)", "Free (Donation)", "Gratuit (Don)", "Gratis (Donación)", "無料（寄付）", "免费（捐赠）"],
  ["Nenhum anúncio disponível nesta seleção.", "Für diese Auswahl sind keine Anzeigen verfügbar.", "No listings are available for this selection.", "Aucune annonce n'est disponible pour cette sélection.", "No hay anuncios disponibles para esta selección.", "この条件に一致する出品はありません。", "此筛选条件下没有可用发布。"],
  ["Entre para acompanhar os seus anúncios.", "Melde dich an, um deine Anzeigen zu verwalten.", "Sign in to track your listings.", "Connectez-vous pour suivre vos annonces.", "Inicia sesión para seguir tus anuncios.", "出品を確認するにはログインしてください。", "登录以跟踪你的发布。"],
  ["Você ainda não publicou nenhum anúncio.", "Du hast noch keine Anzeige veröffentlicht.", "You haven't published any listings yet.", "Vous n'avez encore publié aucune annonce.", "Aún no has publicado ningún anuncio.", "まだ出品を公開していません。", "你还没有发布任何物品。"],
  ["Publicando anúncio", "Anzeige wird veröffentlicht", "Publishing listing", "Publication de l'annonce", "Publicando anuncio", "出品を公開中", "正在发布"],
  ["Salvando alterações do anúncio", "Anzeigenänderungen werden gespeichert", "Saving listing changes", "Enregistrement des modifications", "Guardando cambios del anuncio", "出品の変更を保存中", "正在保存发布更改"],
  ["Atualizando o anúncio...", "Anzeige wird aktualisiert …", "Updating listing...", "Mise à jour de l'annonce…", "Actualizando el anuncio...", "出品を更新中…", "正在更新发布……"],
  ["Excluindo anúncio", "Anzeige wird gelöscht", "Deleting listing", "Suppression de l'annonce", "Eliminando anuncio", "出品を削除中", "正在删除发布"],
  ["Novo item adicionado à coleção.", "Neuer Artikel zur Sammlung hinzugefügt.", "New item added to the collection.", "Nouvel objet ajouté à la collection.", "Nuevo artículo añadido a la colección.", "コレクションに新しい品物を追加しました。", "已将新物品添加到合集。"],
  ["Item removido da coleção.", "Artikel aus der Sammlung entfernt.", "Item removed from the collection.", "Objet retiré de la collection.", "Artículo eliminado de la colección.", "コレクションから品物を削除しました。", "已从合集中移除物品。"],
  ["Concluindo anúncio...", "Anzeige wird abgeschlossen …", "Completing listing...", "Finalisation de l'annonce…", "Finalizando anuncio...", "出品を完了中…", "正在完成发布……"],
  ["Nenhuma conversa pendente", "Keine offenen Unterhaltungen", "No pending conversations", "Aucune conversation en attente", "No hay conversaciones pendientes", "保留中の会話はありません", "没有待处理的会话"],
  ["Adicionar foto", "Foto hinzufügen", "Add photo", "Ajouter une photo", "Añadir foto", "写真を追加", "添加照片"],
  ["Remover foto", "Foto entfernen", "Remove photo", "Supprimer la photo", "Eliminar foto", "写真を削除", "移除照片"],
  ["O Marketplace Vortex conecta pessoas e objetos para prolongar a vida útil de cada item e reduzir desperdícios no campus.", "Marketplace Vortex verbindet Menschen und Dinge, verlängert die Nutzungsdauer jedes Artikels und reduziert Abfall auf dem Campus.", "Marketplace Vortex connects people and items to extend each item's useful life and reduce waste on campus.", "Marketplace Vortex relie les personnes et les objets afin de prolonger leur durée de vie et de réduire les déchets sur le campus.", "Marketplace Vortex conecta personas y objetos para prolongar la vida útil de cada artículo y reducir residuos en el campus.", "Marketplace Vortex は人とモノをつなぎ、品物の寿命を延ばしてキャンパスの廃棄物を減らします。", "Marketplace Vortex 连接人与物品，延长物品使用寿命并减少校园浪费。"],
  ["Publicar anúncio", "Anzeige veröffentlichen", "Publish listing", "Publier l'annonce", "Publicar anuncio", "出品を公開", "发布物品"],
  ["Item 1", "Artikel 1", "Item 1", "Objet 1", "Artículo 1", "品物 1", "物品 1"],
  ["Adicionar outro item", "Weiteren Artikel hinzufügen", "Add another item", "Ajouter un autre objet", "Añadir otro artículo", "別の品物を追加", "添加其他物品"],
  ["Criar coleção", "Sammlung erstellen", "Create collection", "Créer la collection", "Crear colección", "コレクションを作成", "创建合集"],
  ["Meus Anúncios", "Meine Anzeigen", "My listings", "Mes annonces", "Mis anuncios", "自分の出品", "我的发布"],
  ["Entre para acompanhar o interesse nos seus itens.", "Melde dich an, um das Interesse an deinen Artikeln zu verfolgen.", "Sign in to track interest in your items.", "Connectez-vous pour suivre l'intérêt porté à vos objets.", "Inicia sesión para seguir el interés en tus artículos.", "品物への反応を確認するにはログインしてください。", "登录以跟踪他人对你物品的兴趣。"],
  ["Não foi possível carregar os anúncios. Verifique sua conexão e tente novamente.", "Die Anzeigen konnten nicht geladen werden. Prüfe deine Verbindung und versuche es erneut.", "The listings could not be loaded. Check your connection and try again.", "Impossible de charger les annonces. Vérifiez votre connexion et réessayez.", "No se pudieron cargar los anuncios. Comprueba tu conexión e inténtalo de nuevo.", "出品を読み込めませんでした。接続を確認してもう一度お試しください。", "无法加载发布。请检查网络连接后重试。"],
  ["Uma conta.", "Ein Konto.", "One account.", "Un compte.", "Una cuenta.", "一つのアカウントで。", "一个账户。"],
  ["Mais voltas.", "Mehr Kreisläufe.", "More cycles.", "Plus de cycles.", "Más vueltas.", "もっと循環を。", "更多循环。"],
  ["Acesse sua conta ou crie uma gratuitamente.", "Melde dich an oder erstelle kostenlos ein Konto.", "Sign in or create an account for free.", "Connectez-vous ou créez gratuitement un compte.", "Inicia sesión o crea una cuenta gratis.", "ログインするか、無料でアカウントを作成してください。", "登录或免费创建账户。"],
  ["Entrar", "Anmelden", "Sign in", "Se connecter", "Entrar", "ログイン", "登录"],
  ["Criar conta", "Konto erstellen", "Create account", "Créer un compte", "Crear cuenta", "アカウント作成", "创建账户"],
  ["Não será necessário entrar novamente neste dispositivo por até 30 dias.", "Auf diesem Gerät musst du dich bis zu 30 Tage lang nicht erneut anmelden.", "You won't need to sign in again on this device for up to 30 days.", "Vous n'aurez pas à vous reconnecter sur cet appareil pendant 30 jours maximum.", "No tendrás que volver a iniciar sesión en este dispositivo durante un máximo de 30 días.", "この端末では最大30日間、再ログインが不要になります。", "在此设备上最长 30 天内无需再次登录。"],
  ["O cadastro é exclusivo para endereços @edu.unifor.br.", "Die Registrierung ist ausschließlich mit @edu.unifor.br-Adressen möglich.", "Registration is limited to @edu.unifor.br addresses.", "L'inscription est réservée aux adresses @edu.unifor.br.", "El registro es exclusivo para direcciones @edu.unifor.br.", "登録には @edu.unifor.br のメールアドレスが必要です。", "仅限使用 @edu.unifor.br 邮箱注册。"],
  ["Use entre 8 e 72 caracteres.", "Verwende 8 bis 72 Zeichen.", "Use 8 to 72 characters.", "Utilisez entre 8 et 72 caractères.", "Usa entre 8 y 72 caracteres.", "8〜72文字で入力してください。", "请输入 8 到 72 个字符。"],
  ["Digite novamente a mesma senha.", "Gib dasselbe Passwort erneut ein.", "Enter the same password again.", "Saisissez à nouveau le même mot de passe.", "Vuelve a escribir la misma contraseña.", "同じパスワードをもう一度入力してください。", "请再次输入相同的密码。"],
  ["Criar minha conta", "Mein Konto erstellen", "Create my account", "Créer mon compte", "Crear mi cuenta", "アカウントを作成", "创建我的账户"],
  ["Sua conta é exclusiva para a comunidade acadêmica da UNIFOR.", "Dein Konto ist ausschließlich für die akademische Gemeinschaft der UNIFOR bestimmt.", "Your account is exclusive to the UNIFOR academic community.", "Votre compte est réservé à la communauté universitaire de l'UNIFOR.", "Tu cuenta es exclusiva para la comunidad académica de UNIFOR.", "このアカウントはUNIFORの学術コミュニティ専用です。", "你的账户仅供 UNIFOR 学术社区使用。"],
  ["Esta ação remove o item do catálogo público e registra uma oferta concluída.", "Diese Aktion entfernt den Artikel aus dem öffentlichen Katalog und erfasst ein abgeschlossenes Angebot.", "This action removes the item from the public catalog and records a completed offer.", "Cette action retire l'objet du catalogue public et enregistre une offre conclue.", "Esta acción elimina el artículo del catálogo público y registra una oferta finalizada.", "この操作で品物が公開カタログから削除され、成立したオファーとして記録されます。", "此操作会从公共目录中移除物品，并记录一笔已完成的报价。"],
  ["Digite o e-mail da sua conta para confirmar", "Gib zur Bestätigung die E-Mail-Adresse deines Kontos ein", "Enter your account email to confirm", "Saisissez l'adresse e-mail de votre compte pour confirmer", "Escribe el correo de tu cuenta para confirmar", "確認のためアカウントのメールアドレスを入力", "输入账户邮箱以确认"],
  ["Altere as informações necessárias e salve para atualizar o catálogo.", "Ändere die erforderlichen Angaben und speichere, um den Katalog zu aktualisieren.", "Update the necessary information and save to refresh the catalog.", "Modifiez les informations nécessaires et enregistrez pour actualiser le catalogue.", "Cambia la información necesaria y guarda para actualizar el catálogo.", "必要な情報を変更し、保存してカタログを更新してください。", "修改所需信息并保存，以更新目录。"],
  ["Categoria:", "Kategorie:", "Category:", "Catégorie :", "Categoría:", "カテゴリー：", "类别："],
  ["Condição:", "Zustand:", "Condition:", "État :", "Estado:", "状態：", "状况："],
  ["Localização para retirada:", "Abholort:", "Pickup location:", "Lieu de retrait :", "Lugar de recogida:", "受け取り場所：", "取货地点："],
  ["Encontramos coleções criadas como", "Wir haben Sammlungen gefunden, die erstellt wurden als", "We found collections created as", "Nous avons trouvé des collections créées sous le nom", "Encontramos colecciones creadas como", "次の名前で作成されたコレクションが見つかりました：", "我们找到了以此身份创建的合集："],
  ["antes de você entrar nesta conta.", "bevor du dich bei diesem Konto angemeldet hast.", "before you signed in to this account.", "avant votre connexion à ce compte.", "antes de que iniciaras sesión en esta cuenta.", "このアカウントにログインする前のものです。", "这些合集创建于你登录此账户之前。"],
  ["Importar associa somente essas coleções à conta atual. Manter como estão preserva a identidade e os dados antigos sem alterações.", "Beim Import werden nur diese Sammlungen mit dem aktuellen Konto verknüpft. Wenn du sie beibehältst, bleiben die frühere Identität und die Daten unverändert erhalten.", "Importing only links these collections to the current account. Keeping them as they are preserves the previous identity and data unchanged.", "L'importation associe uniquement ces collections au compte actuel. Les conserver en l'état préserve l'ancienne identité et les données sans modification.", "Importar solo vincula estas colecciones a la cuenta actual. Mantenerlas como están conserva la identidad y los datos anteriores sin cambios.", "インポートすると、これらのコレクションだけが現在のアカウントに関連付けられます。そのまま保持すると、以前のIDとデータは変更されません。", "导入只会将这些合集关联到当前账户。保持原样则会保留旧身份和数据，不做更改。"],
  ["Importar para esta conta", "In dieses Konto importieren", "Import to this account", "Importer dans ce compte", "Importar a esta cuenta", "このアカウントにインポート", "导入到此账户"],
  ["Manter coleções antigas", "Alte Sammlungen beibehalten", "Keep old collections", "Conserver les anciennes collections", "Mantener colecciones antiguas", "以前のコレクションを保持", "保留旧合集"],
  ["Remover", "Entfernen", "Remove", "Retirer", "Eliminar", "削除", "移除"],
  ["Meus anúncios", "Meine Anzeigen", "My listings", "Mes annonces", "Mis anuncios", "自分の出品", "我的发布"],
  ["Estudos de Engenharia", "Ingenieurstudium", "Engineering studies", "Études d'ingénierie", "Estudios de ingeniería", "工学の学習用品", "工程学习用品"],
  ["Doações Bloco Q", "Spenden – Block Q", "Block Q donations", "Dons — bâtiment Q", "Donaciones del Bloque Q", "Q棟の寄付品", "Q 楼捐赠"],
  ["Eletrônicos e Gadgets", "Elektronik und Gadgets", "Electronics and gadgets", "Électronique et gadgets", "Electrónica y gadgets", "電子機器・ガジェット", "电子产品和小工具"],
  ["Kit Sobrevivência CC", "Survival-Kit Gemeinschaftszentrum", "Student Center essentials", "Kit essentiel du centre étudiant", "Kit esencial del Centro de Convivencia", "交流センターお役立ちセット", "学生活动中心必备套装"],
  ["Por Pedro Mapu · 12 itens", "Von Pedro Mapu · 12 Artikel", "By Pedro Mapu · 12 items", "Par Pedro Mapu · 12 objets", "Por Pedro Mapu · 12 artículos", "Pedro Mapu・12点", "Pedro Mapu · 12 件物品"],
  ["Por Julia Costa · 8 itens", "Von Julia Costa · 8 Artikel", "By Julia Costa · 8 items", "Par Julia Costa · 8 objets", "Por Julia Costa · 8 artículos", "Julia Costa・8点", "Julia Costa · 8 件物品"],
  ["Por Lucas Andrade · 15 itens", "Von Lucas Andrade · 15 Artikel", "By Lucas Andrade · 15 items", "Par Lucas Andrade · 15 objets", "Por Lucas Andrade · 15 artículos", "Lucas Andrade・15点", "Lucas Andrade · 15 件物品"],
  ["Por Sofia Reis · 6 itens", "Von Sofia Reis · 6 Artikel", "By Sofia Reis · 6 items", "Par Sofia Reis · 6 objets", "Por Sofia Reis · 6 artículos", "Sofia Reis・6点", "Sofia Reis · 6 件物品"],
  ["Livros, réguas acadêmicas e apostilas recomendadas para os primeiros semestres.", "Bücher, Zeichengeräte und Skripte, die für die ersten Semester empfohlen werden.", "Books, drafting tools, and study guides recommended for the first semesters.", "Livres, instruments de dessin et polycopiés recommandés pour les premiers semestres.", "Libros, instrumentos de dibujo y apuntes recomendados para los primeros semestres.", "最初の学期におすすめの書籍、製図用具、教材です。", "适合前几个学期使用的书籍、绘图工具和讲义。"],
  ["Materiais de desenho e artigos de moda que estou doando no Bloco Q.", "Zeichenmaterialien und Modeartikel, die ich in Block Q verschenke.", "Drawing supplies and fashion items I'm donating in Block Q.", "Matériel de dessin et articles de mode que je donne au bâtiment Q.", "Materiales de dibujo y artículos de moda que dono en el Bloque Q.", "Q棟で寄付する画材とファッション用品です。", "我在 Q 楼捐赠的绘图用品和时尚物品。"],
  ["Cabos, carregadores e periféricos seminovos que não utilizo mais.", "Kabel, Ladegeräte und neuwertige Peripheriegeräte, die ich nicht mehr brauche.", "Cables, chargers, and like-new peripherals I no longer use.", "Câbles, chargeurs et périphériques presque neufs que je n'utilise plus.", "Cables, cargadores y periféricos seminuevos que ya no uso.", "使わなくなったケーブル、充電器、状態の良い周辺機器です。", "不再使用的线缆、充电器和近新外设。"],
  ["Itens para armários e lockers do Centro de Convivência.", "Artikel für Schränke und Schließfächer im Gemeinschaftszentrum.", "Items for cabinets and lockers at the Student Center.", "Objets pour les armoires et casiers du centre de vie étudiante.", "Artículos para armarios y casilleros del Centro de Convivencia.", "交流センターの収納やロッカーに便利な品物です。", "适用于学生活动中心储物柜的物品。"],
  ["🎒 45 Itens · 🛒 20 Trocas", "🎒 45 Artikel · 🛒 20 Tauschvorgänge", "🎒 45 items · 🛒 20 exchanges", "🎒 45 objets · 🛒 20 échanges", "🎒 45 artículos · 🛒 20 intercambios", "🎒 45点 · 🛒 20件の取引", "🎒 45 件物品 · 🛒 20 次交换"],
  ["📚 32 Itens · 🛒 15 Trocas", "📚 32 Artikel · 🛒 15 Tauschvorgänge", "📚 32 items · 🛒 15 exchanges", "📚 32 objets · 🛒 15 échanges", "📚 32 artículos · 🛒 15 intercambios", "📚 32点 · 🛒 15件の取引", "📚 32 件物品 · 🛒 15 次交换"],
  ["🪴 28 Itens · 🛒 12 Trocas", "🪴 28 Artikel · 🛒 12 Tauschvorgänge", "🪴 28 items · 🛒 12 exchanges", "🪴 28 objets · 🛒 12 échanges", "🪴 28 artículos · 🛒 12 intercambios", "🪴 28点 · 🛒 12件の取引", "🪴 28 件物品 · 🛒 12 次交换"],
  ["🎧 24 Itens · 🛒 10 Trocas", "🎧 24 Artikel · 🛒 10 Tauschvorgänge", "🎧 24 items · 🛒 10 exchanges", "🎧 24 objets · 🛒 10 échanges", "🎧 24 artículos · 🛒 10 intercambios", "🎧 24点 · 🛒 10件の取引", "🎧 24 件物品 · 🛒 10 次交换"],
  ["👜 19 Itens · 🛒 8 Trocas", "👜 19 Artikel · 🛒 8 Tauschvorgänge", "👜 19 items · 🛒 8 exchanges", "👜 19 objets · 🛒 8 échanges", "👜 19 artículos · 🛒 8 intercambios", "👜 19点 · 🛒 8件の取引", "👜 19 件物品 · 🛒 8 次交换"],
  ["🔌 15 Itens · 🛒 7 Trocas", "🔌 15 Artikel · 🛒 7 Tauschvorgänge", "🔌 15 items · 🛒 7 exchanges", "🔌 15 objets · 🛒 7 échanges", "🔌 15 artículos · 🛒 7 intercambios", "🔌 15点 · 🛒 7件の取引", "🔌 15 件物品 · 🛒 7 次交换"],
  ["Como podemos ajudar?", "Wie können wir helfen?", "How can we help?", "Comment pouvons-nous vous aider ?", "¿Cómo podemos ayudarte?", "どのようにお手伝いできますか？", "我们能如何帮助你？"],
  ["Quem pode criar uma conta?", "Wer kann ein Konto erstellen?", "Who can create an account?", "Qui peut créer un compte ?", "¿Quién puede crear una cuenta?", "誰がアカウントを作成できますか？", "谁可以创建账户？"],
  ["O cadastro é exclusivo para pessoas com e-mail institucional @edu.unifor.br.", "Die Registrierung ist Personen mit einer institutionellen @edu.unifor.br-Adresse vorbehalten.", "Registration is limited to people with an institutional @edu.unifor.br email address.", "L'inscription est réservée aux personnes disposant d'une adresse institutionnelle @edu.unifor.br.", "El registro es exclusivo para personas con correo institucional @edu.unifor.br.", "登録できるのは、@edu.unifor.br の大学メールアドレスを持つ方のみです。", "仅限拥有 @edu.unifor.br 机构邮箱的人员注册。"],
  ["Como anunciar um item?", "Wie stelle ich einen Artikel ein?", "How do I list an item?", "Comment publier un objet ?", "¿Cómo publico un artículo?", "品物を出品するには？", "如何发布物品？"],
  ["Entre na conta, abra Anunciar e informe modalidade, condição, retirada e descrição. Você poderá editar ou concluir o anúncio depois.", "Melde dich an, öffne „Inserieren“ und gib Angebotsart, Zustand, Abholung und Beschreibung an. Du kannst die Anzeige später bearbeiten oder abschließen.", "Sign in, open List an item, and enter the listing type, condition, pickup details, and description. You can edit or complete the listing later.", "Connectez-vous, ouvrez Publier et renseignez la modalité, l'état, le retrait et la description. Vous pourrez modifier ou finaliser l'annonce plus tard.", "Inicia sesión, abre Publicar e informa la modalidad, el estado, la recogida y la descripción. Podrás editar o finalizar el anuncio después.", "ログインして「出品する」を開き、取引方法、状態、受け取り、説明を入力します。後から編集や完了ができます。", "登录后打开“发布”，填写方式、状况、取货信息和描述。之后可编辑或完成发布。"],
  ["Como funciona a negociação?", "Wie funktioniert die Verhandlung?", "How does negotiation work?", "Comment fonctionne la négociation ?", "¿Cómo funciona la negociación?", "交渉はどのように進みますか？", "如何协商？"],
  ["Abra os detalhes de um anúncio, envie uma oferta e combine a retirada pelo chat. O Vortex não processa pagamentos.", "Öffne die Details einer Anzeige, sende ein Angebot und vereinbare die Abholung im Chat. Vortex verarbeitet keine Zahlungen.", "Open a listing's details, send an offer, and arrange pickup in chat. Vortex does not process payments.", "Ouvrez les détails d'une annonce, envoyez une offre et organisez le retrait par chat. Vortex ne traite pas les paiements.", "Abre los detalles de un anuncio, envía una oferta y acuerda la recogida por chat. Vortex no procesa pagos.", "出品の詳細を開き、オファーを送り、チャットで受け取りを調整します。Vortexは決済を処理しません。", "打开发布详情，发送报价，并在聊天中安排取货。Vortex 不处理付款。"],
  ["Contato e suporte", "Kontakt und Support", "Contact and support", "Contact et assistance", "Contacto y soporte", "お問い合わせ・サポート", "联系与支持"],
  ["O Marketplace Vortex é um projeto acadêmico desenvolvido para a Universidade de Fortaleza.", "Marketplace Vortex ist ein akademisches Projekt für die Universidade de Fortaleza.", "Marketplace Vortex is an academic project developed for the University of Fortaleza.", "Marketplace Vortex est un projet universitaire développé pour l'Université de Fortaleza.", "Marketplace Vortex es un proyecto académico desarrollado para la Universidad de Fortaleza.", "Marketplace Vortexはフォルタレザ大学のために開発された学術プロジェクトです。", "Marketplace Vortex 是为福塔莱萨大学开发的学术项目。"],
  ["Para relatar um problema técnico, abra uma ocorrência no repositório do projeto sem incluir senhas, tokens, conversas privadas ou outros dados pessoais.", "Um ein technisches Problem zu melden, erstelle ein Issue im Projekt-Repository, ohne Passwörter, Tokens, private Unterhaltungen oder andere personenbezogene Daten anzugeben.", "To report a technical issue, open an issue in the project repository without including passwords, tokens, private conversations, or other personal data.", "Pour signaler un problème technique, ouvrez un ticket dans le dépôt du projet sans inclure de mots de passe, jetons, conversations privées ni autres données personnelles.", "Para informar de un problema técnico, abre una incidencia en el repositorio sin incluir contraseñas, tokens, conversaciones privadas ni otros datos personales.", "技術的な問題は、パスワード、トークン、非公開の会話などの個人情報を含めず、プロジェクトのリポジトリでIssueを作成してください。", "如需报告技术问题，请在项目仓库中提交问题，请勿包含密码、令牌、私人对话或其他个人数据。"],
  ["Abrir uma ocorrência no GitHub", "Issue auf GitHub erstellen", "Open an issue on GitHub", "Ouvrir un ticket sur GitHub", "Abrir una incidencia en GitHub", "GitHubでIssueを作成", "在 GitHub 上提交问题"],
  ["Uso da comunidade", "Nutzung in der Community", "Community use", "Utilisation par la communauté", "Uso de la comunidad", "コミュニティでの利用", "社区使用"],
  ["O Vortex foi criado para a circulação de itens entre integrantes da comunidade acadêmica da UNIFOR. Cada pessoa é responsável pela veracidade do anúncio que publica.", "Vortex wurde für die Weitergabe von Artikeln innerhalb der akademischen UNIFOR-Community entwickelt. Jede Person ist für die Richtigkeit ihrer Anzeigen verantwortlich.", "Vortex was created to circulate items among members of the UNIFOR academic community. Each person is responsible for the accuracy of the listings they publish.", "Vortex a été créé pour faire circuler des objets entre les membres de la communauté universitaire de l'UNIFOR. Chacun est responsable de l'exactitude de ses annonces.", "Vortex se creó para que los artículos circulen entre la comunidad académica de UNIFOR. Cada persona es responsable de la veracidad de los anuncios que publica.", "VortexはUNIFORの学術コミュニティ内で品物を循環させるために作られました。出品内容の正確性は各出品者が責任を負います。", "Vortex 旨在促进物品在 UNIFOR 学术社区成员之间流转。每个人都应对其发布信息的真实性负责。"],
  ["Anúncios e negociação", "Anzeigen und Verhandlung", "Listings and negotiation", "Annonces et négociation", "Anuncios y negociación", "出品と交渉", "发布与协商"],
  ["Não publique itens proibidos, ilegais ou que coloquem outras pessoas em risco. Valores, pagamentos e retirada são combinados diretamente entre as partes; a plataforma não intermedeia pagamentos.", "Veröffentliche keine verbotenen, illegalen oder gefährlichen Artikel. Preise, Zahlungen und Abholung werden direkt zwischen den Parteien vereinbart; die Plattform vermittelt keine Zahlungen.", "Do not publish prohibited, illegal, or dangerous items. Prices, payments, and pickup are arranged directly between the parties; the platform does not process payments.", "Ne publiez pas d'objets interdits, illégaux ou dangereux. Les prix, paiements et retraits sont convenus directement entre les parties ; la plateforme n'intervient pas dans les paiements.", "No publiques artículos prohibidos, ilegales o peligrosos. Los valores, pagos y la recogida se acuerdan directamente entre las partes; la plataforma no intermedia pagos.", "禁止品、違法な品物、他者を危険にさらす品物は出品しないでください。価格、支払い、受け取りは当事者間で直接調整し、プラットフォームは決済を仲介しません。", "请勿发布违禁、违法或危及他人的物品。价格、付款和取货由双方直接商定；平台不参与付款。"],
  ["Segurança", "Sicherheit", "Safety", "Sécurité", "Seguridad", "安全", "安全"],
  ["Proteja sua senha, não compartilhe códigos de acesso e prefira locais movimentados do campus para realizar a retirada.", "Schütze dein Passwort, teile keine Zugangscodes und wähle für die Abholung belebte Orte auf dem Campus.", "Protect your password, do not share access codes, and prefer busy campus locations for pickup.", "Protégez votre mot de passe, ne partagez pas vos codes d'accès et privilégiez les lieux fréquentés du campus pour le retrait.", "Protege tu contraseña, no compartas códigos de acceso y elige lugares concurridos del campus para la recogida.", "パスワードを保護し、アクセスコードを共有せず、受け取りにはキャンパス内の人通りの多い場所を選んでください。", "保护好密码，不要分享访问码，并优先选择校园内人流较多的地点取货。"],
  ["Dados utilizados", "Verwendete Daten", "Data used", "Données utilisées", "Datos utilizados", "利用するデータ", "使用的数据"],
  ["A plataforma utiliza nome, e-mail institucional, foto opcional, anúncios, ofertas e mensagens para oferecer os recursos da conta.", "Die Plattform verwendet Name, institutionelle E-Mail-Adresse, optionales Foto, Anzeigen, Angebote und Nachrichten, um die Kontofunktionen bereitzustellen.", "The platform uses your name, institutional email, optional photo, listings, offers, and messages to provide account features.", "La plateforme utilise votre nom, votre adresse institutionnelle, une photo facultative, vos annonces, offres et messages pour fournir les fonctionnalités du compte.", "La plataforma utiliza nombre, correo institucional, foto opcional, anuncios, ofertas y mensajes para ofrecer las funciones de la cuenta.", "プラットフォームは、アカウント機能の提供に名前、大学メール、任意の写真、出品、オファー、メッセージを使用します。", "平台使用姓名、机构邮箱、可选照片、发布、报价和消息来提供账户功能。"],
  ["Sessão e armazenamento", "Sitzung und Speicherung", "Session and storage", "Session et stockage", "Sesión y almacenamiento", "セッションと保存", "会话与存储"],
  ["O acesso é mantido no navegador conforme a opção escolhida no login. Consultas públicas do catálogo podem ser armazenadas no dispositivo para funcionamento offline; dados autenticados e mensagens não entram nesse cache.", "Der Zugriff bleibt je nach Anmeldeoption im Browser gespeichert. Öffentliche Katalogabfragen können für die Offline-Nutzung auf dem Gerät gespeichert werden; authentifizierte Daten und Nachrichten werden nicht in diesem Cache abgelegt.", "Access is kept in the browser according to the option selected at sign-in. Public catalog queries may be stored on the device for offline use; authenticated data and messages are not included in that cache.", "L'accès est conservé dans le navigateur selon l'option choisie lors de la connexion. Les consultations publiques du catalogue peuvent être stockées sur l'appareil pour un usage hors ligne ; les données authentifiées et les messages ne sont pas inclus dans ce cache.", "El acceso se mantiene en el navegador según la opción elegida al iniciar sesión. Las consultas públicas del catálogo pueden almacenarse en el dispositivo para uso sin conexión; los datos autenticados y los mensajes no entran en esa caché.", "ログイン時の選択に応じてブラウザにログイン状態が保持されます。公開カタログの検索結果はオフライン利用のため端末に保存される場合がありますが、認証済みデータやメッセージはキャッシュされません。", "登录状态会根据登录时的选择保留在浏览器中。公共目录查询可存储在设备上以供离线使用；已认证数据和消息不会进入该缓存。"],
  ["Cuidados ao publicar", "Hinweise beim Veröffentlichen", "Publishing safely", "Précautions lors de la publication", "Cuidados al publicar", "公開時の注意", "发布注意事项"],
  ["Evite incluir telefone, endereço residencial ou outras informações sensíveis em anúncios e mensagens. Informe apenas o necessário para combinar a retirada no campus.", "Gib in Anzeigen und Nachrichten keine Telefonnummer, Wohnadresse oder andere sensible Daten an. Teile nur die Informationen, die für die Abholung auf dem Campus erforderlich sind.", "Avoid including phone numbers, home addresses, or other sensitive information in listings and messages. Share only what is needed to arrange pickup on campus.", "Évitez d'inclure un numéro de téléphone, une adresse personnelle ou d'autres informations sensibles dans les annonces et messages. N'indiquez que ce qui est nécessaire pour organiser le retrait sur le campus.", "Evita incluir teléfono, dirección particular u otra información sensible en anuncios y mensajes. Indica solo lo necesario para acordar la recogida en el campus.", "出品やメッセージに電話番号、自宅住所などの機密情報を含めないでください。キャンパスでの受け取り調整に必要な情報だけを伝えてください。", "避免在发布和消息中填写电话号码、家庭住址或其他敏感信息。仅提供安排校园取货所需的信息。"],
];

const INDICE_IDIOMA: Readonly<Record<CodigoIdioma, number>> = {
  "pt-BR": 0,
  de: 1,
  en: 2,
  fr: 3,
  es: 4,
  ja: 5,
  "zh-CN": 6,
};

function normalizarTexto(valor: string): string {
  return valor.trim().replace(/\s+/g, " ");
}

const FRASES_POR_ORIGINAL = new Map(
  FRASES.map((frase) => [normalizarTexto(frase[0]), frase]),
);
const originaisTexto = new WeakMap<Text, string>();
const originaisAtributo = new WeakMap<Element, Map<string, string>>();
let idiomaAtual: CodigoIdioma = carregarIdioma();
let aplicandoTraducao = false;

function idiomaSuportado(valor: unknown): valor is CodigoIdioma {
  return typeof valor === "string" && IDIOMAS.includes(valor as CodigoIdioma);
}

function carregarIdioma(): CodigoIdioma {
  try {
    const salvo = window.localStorage.getItem(CHAVE_IDIOMA);
    return idiomaSuportado(salvo) ? salvo : "pt-BR";
  } catch {
    return "pt-BR";
  }
}

function traduzir(original: string): string | null {
  const frase = FRASES_POR_ORIGINAL.get(normalizarTexto(original));
  return frase?.[INDICE_IDIOMA[idiomaAtual]] ?? null;
}

function preservarEspacos(valor: string, traducao: string): string {
  const inicio = valor.match(/^\s*/)?.[0] ?? "";
  const fim = valor.match(/\s*$/)?.[0] ?? "";
  return `${inicio}${traducao}${fim}`;
}

function aplicarTexto(no: Text): void {
  const valor = no.nodeValue ?? "";
  const limpo = valor.trim();
  const normalizado = normalizarTexto(limpo);
  let original = originaisTexto.get(no);

  if (!original) {
    if (!FRASES_POR_ORIGINAL.has(normalizado)) return;
    original = normalizado;
    originaisTexto.set(no, original);
  }

  const traducao = traduzir(original);
  if (traducao === null || limpo === traducao) return;
  no.nodeValue = preservarEspacos(valor, traducao);
}

function aplicarAtributo(elemento: Element, atributo: string): void {
  const valor = elemento.getAttribute(atributo)?.trim();
  if (!valor) return;

  let originais = originaisAtributo.get(elemento);
  if (!originais) {
    originais = new Map();
    originaisAtributo.set(elemento, originais);
  }

  let original = originais.get(atributo);
  if (!original) {
    const normalizado = normalizarTexto(valor);
    if (!FRASES_POR_ORIGINAL.has(normalizado)) return;
    original = normalizado;
    originais.set(atributo, original);
  }

  const traducao = traduzir(original);
  if (traducao !== null && valor !== traducao) elemento.setAttribute(atributo, traducao);
}

function aplicarNaArvore(raiz: Node): void {
  if (raiz instanceof Element && ELEMENTOS_IGNORADOS.has(raiz.tagName)) return;

  aplicandoTraducao = true;
  try {
    if (raiz instanceof Text) aplicarTexto(raiz);

    if (raiz instanceof Element) {
      ATRIBUTOS_TRADUZIVEIS.forEach((atributo) => aplicarAtributo(raiz, atributo));
    }

    const documento = raiz instanceof Document ? raiz : raiz.ownerDocument;
    if (!documento) return;

    const caminhante = documento.createTreeWalker(
      raiz,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode(no) {
          if (no instanceof Element && ELEMENTOS_IGNORADOS.has(no.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    let no = caminhante.nextNode();
    while (no) {
      if (no instanceof Text) aplicarTexto(no);
      else if (no instanceof Element) {
        const elemento = no;
        ATRIBUTOS_TRADUZIVEIS.forEach((atributo) => aplicarAtributo(elemento, atributo));
      }
      no = caminhante.nextNode();
    }
  } finally {
    aplicandoTraducao = false;
  }
}

function atualizarIdioma(codigo: CodigoIdioma): void {
  idiomaAtual = codigo;
  aplicarNaArvore(document);
}

const observador = new MutationObserver((mutacoes) => {
  if (aplicandoTraducao) return;

  mutacoes.forEach((mutacao) => {
    if (mutacao.type === "childList") {
      mutacao.addedNodes.forEach((no) => aplicarNaArvore(no));
    } else if (mutacao.type === "characterData") {
      aplicarNaArvore(mutacao.target);
    } else if (mutacao.type === "attributes" && mutacao.target instanceof Element) {
      aplicarAtributo(mutacao.target, mutacao.attributeName ?? "");
    }
  });
});

aplicarNaArvore(document);
observador.observe(document.documentElement, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: [...ATRIBUTOS_TRADUZIVEIS],
});

document.addEventListener("vortex:languagechange", (evento) => {
  const codigo = (evento as CustomEvent<{ language?: unknown }>).detail?.language;
  if (idiomaSuportado(codigo)) atualizarIdioma(codigo);
});

window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_IDIOMA && idiomaSuportado(evento.newValue)) {
    atualizarIdioma(evento.newValue);
  }
});
