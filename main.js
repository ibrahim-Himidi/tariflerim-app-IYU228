// header
let menuAcik = false;

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');

    if (!menuAcik) {
        // Menü aç
        menu.classList.remove('max-h-0', 'opacity-0');
        menu.classList.add('max-h-60', 'opacity-100');

        // İkon değiştir
        menuIcon.classList.replace('opacity-100', 'opacity-0');
        closeIcon.classList.replace('opacity-0', 'opacity-100');

        menuAcik = true;
    } else {
        // Menü kapa
        menu.classList.remove('max-h-60', 'opacity-100');
        menu.classList.add('max-h-0', 'opacity-0');

        // İkon geri
        closeIcon.classList.replace('opacity-100', 'opacity-0');
        menuIcon.classList.replace('opacity-0', 'opacity-100');

        menuAcik = false;
    }
}

// Hero Slider
let aktifSlayt = 0;
const toplamSlayt = 3;
let sliderInterval;

function guncelleSlayt() {
    for (let i = 0; i < toplamSlayt; i++) {
        document.getElementById(`slide-${i}`).style.opacity = '0';
    }
    document.getElementById(`slide-${aktifSlayt}`).style.opacity = '1';
}

function guncelleDotlar() {
    for (let i = 0; i < toplamSlayt; i++) {
        const dot = document.getElementById(`dot-${i}`);
        dot.classList.remove('bg-orange-400', 'opacity-100');
        dot.classList.add('opacity-60');
    }
    const aktifDot = document.getElementById(`dot-${aktifSlayt}`);
    aktifDot.classList.remove('opacity-60');
    aktifDot.classList.add('bg-orange-400', 'opacity-100');
}

function startSlider() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        aktifSlayt = (aktifSlayt + 1) % toplamSlayt;
        guncelleSlayt();
        guncelleDotlar();
    }, 5000);
}

function changeSlide(index) {
    aktifSlayt = index;
    guncelleSlayt();
    guncelleDotlar();
    startSlider();
}

// Yemek Adı ile Arama
async function tarifAra() {
    const query = document.getElementById('searchInput').value.trim();
    const sonucContainerId = 'aramaSonuclari';
    let sonucContainer = document.getElementById(sonucContainerId);

    if (!sonucContainer) {
        sonucContainer = document.createElement('div');
        sonucContainer.id = sonucContainerId;
        sonucContainer.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6";
        document.getElementById('searchSection').appendChild(sonucContainer);
    }

    if (!query) {
        alert('Lütfen aramak istediğiniz yemek adını girin.');
        return;
    }

    sonucContainer.innerHTML = `
                <div class="col-span-3 text-center py-8 text-orange-500 text-xl sm:text-2xl">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p class="mt-4">Tarifler aranıyor...</p>
                </div>`;

    try {
        const apiKey = "92ed44c814c441c38cc63c53fd3bf901";
        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=6&apiKey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API isteği başarısız');

        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            sonucContainer.innerHTML = `
                        <div class="col-span-3 text-center py-8 text-gray-500 text-sm sm:text-base">
                            <i class="fas fa-utensils text-2xl sm:text-3xl"></i>
                            <p class="mt-4">Aradığınız yemek için tarif bulunamadı.</p>
                        </div>`;
            return;
        }

        sonucContainer.innerHTML = '';
        data.results.forEach(tarif => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow";
            card.innerHTML = `
                        <img src="${tarif.image || 'https://via.placeholder.com/300x200?text=Resim+Yok'}" alt="${tarif.title}" class="w-full h-40 sm:h-48 object-cover" />
                        <div class="p-4 sm:p-6">
                            <h3 class="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">${tarif.title}</h3>
                            <a href="https://spoonacular.com/recipes/${tarif.title.replace(/\s+/g, '-').toLowerCase()}-${tarif.id}" target="_blank" class="inline-block mt-2 sm:mt-3 text-orange-500 font-medium hover:underline text-sm sm:text-base">
                                Tarifi Gör <i class="fas fa-external-link-alt ml-1"></i>
                            </a>
                        </div>`;
            sonucContainer.appendChild(card);
        });
    } catch (error) {
        sonucContainer.innerHTML = `
                    <div class="col-span-3 text-center py-8 text-red-500 text-sm sm:text-base">
                        <i class="fas fa-exclamation-triangle text-2xl sm:text-3xl"></i>
                        <p class="mt-4">Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                    </div>`;
        console.error(error);
    }
}

// Malzeme ile Arama
const malzemeListesi = [
    "tomato", "onion", "garlic", "potato", "pepper", "carrot", "zucchini", "rice", "flour", "chicken",
    "beef", "lamb", "turkey", "cheese", "milk", "yogurt", "parsley", "mint", "dill", "lentils",
    "red pepper", "olive oil", "salt", "black pepper", "butter", "egg", "spinach", "leek", "eggplant", "green beans",
    "corn", "cucumber", "bread", "cabbage", "broccoli", "cauliflower", "mushroom", "chickpeas", "beans", "peas",
    "sugar", "vanilla", "baking powder", "baking soda", "cream", "whipping cream", "cornstarch", "gelatin", "lemon", "lime",
    "orange", "apple", "banana", "strawberry", "blueberry", "raspberry", "pineapple", "kiwi", "peach", "apricot",
    "grape", "watermelon", "melon", "pomegranate", "fig", "date", "walnut", "hazelnut", "almond", "peanut",
    "cashew", "pistachio", "sunflower oil", "canola oil", "vegetable oil", "soy sauce", "worcestershire sauce", "hot sauce", "barbecue sauce", "ketchup",
    "mustard", "mayonnaise", "honey", "molasses", "maple syrup", "vinegar", "balsamic vinegar", "apple cider vinegar", "white wine", "red wine",
    "yeast", "pasta", "spaghetti", "macaroni", "noodles", "lasagna sheets", "tortilla", "bread crumbs", "oats", "cereal",
    "granola", "coconut", "coconut milk", "coconut oil", "avocado", "basil", "thyme", "rosemary", "oregano", "curry powder",
    "cumin", "paprika", "chili flakes", "coriander", "turmeric", "ginger", "cardamom", "clove", "cinnamon", "nutmeg",
    "bay leaf", "mustard seeds", "sesame seeds", "poppy seeds", "fennel", "saffron", "anchovy", "salmon", "tuna", "shrimp",
    "squid", "octopus", "mussels", "clams", "crab", "lobster", "trout", "mackerel", "sardines", "sea bass",
    "duck", "goose", "quail", "rabbit", "beef liver", "kidney", "tripe", "sausage", "salami", "bacon",
    "ham", "meatballs", "ground beef", "ground chicken", "meat broth", "chicken broth", "vegetable broth", "stock cubes", "gelatin sheets", "tofu",
    "tempeh", "seitan", "soy milk", "almond milk", "oat milk", "hazelnut milk", "chia seeds", "flax seeds", "hemp seeds", "quinoa",
    "bulgur", "couscous", "barley", "rye", "buckwheat", "spelt", "farro", "amaranth", "polenta", "grits",
    "pickles", "olives", "sun-dried tomatoes", "capers", "artichoke", "arugula", "rocket", "lettuce", "iceberg", "romaine",
    "endive", "chard", "kale", "collard greens", "turnip", "parsnip", "radish", "beetroot", "okra", "seaweed",
    "miso", "tamari", "sriracha", "tabasco", "kimchi", "sauerkraut", "naan", "pita", "lavash", "bagel",
    "croissant", "brioche", "buns", "taco shells", "wraps", "dumpling wrappers", "spring roll wrappers", "phyllo dough", "pizza dough", "pie crust",
    "puff pastry", "shortcrust pastry", "cake flour", "bread flour", "semolina", "cornmeal", "masa harina", "gluten-free flour", "arrowroot", "agar agar",
    "baking chocolate", "cocoa powder", "white chocolate", "dark chocolate", "chocolate chips", "marshmallows", "caramel", "butterscotch", "sweetened condensed milk", "evaporated milk",
    "cream cheese", "ricotta", "mozzarella", "feta", "gouda", "cheddar", "parmesan", "brie", "camembert", "blue cheese",
    "ice cream", "sorbet", "yogurt drink", "buttermilk", "labneh", "kefir", "espresso", "coffee", "tea", "matcha",
    "green tea", "black tea", "chai", "cappuccino", "latte", "cocoa", "cola", "lemonade", "orange juice", "apple juice",
    "smoothie", "protein powder", "isot pepper", "pomegranate molasses", "tamarind paste", "fish sauce", "hoisin sauce", "mirin", "rice vinegar", "wasabi",
    "ginger paste", "garlic paste", "onion powder", "curry paste", "herbes de provence", "italian seasoning", "creme fraiche", "aioli", "salsa", "guacamole",
    "hummus", "baba ghanoush", "tzatziki", "tahini", "falafel", "pancetta", "prosciutto", "ribs", "steak", "brisket",
    "short ribs", "meatloaf", "pâté", "stuffing", "gravy", "cranberry sauce", "coleslaw", "mashed potatoes", "french fries", "roasted vegetables",
    "stuffed peppers", "ratatouille", "casserole", "quiche", "frittata", "omelette", "scrambled eggs", "boiled eggs", "fried eggs", "poached eggs",
    "deviled eggs", "muffins", "cupcakes", "cake", "cheesecake", "brownies", "cookies", "biscuits", "scones", "tarts",
    "pies", "crumble", "pudding", "jelly", "fruit salad", "compote", "jam", "marmalade", "granita", "trifle",
    "agave syrup", "alfalfa sprouts", "allspice", "ancho chili powder", "anise", "annatto", "apricot jam", "artichoke hearts",
    "asafetida", "asafoetida", "balsamic glaze", "bamboo shoots", "barley malt", "bay scallops", "bean sprouts", "bee pollen",
    "beet greens", "bell pepper", "black beans", "black cardamom", "black garlic", "black olives", "black sesame seeds",
    "black treacle", "blood orange", "bone marrow", "borage", "bran", "brazilian nuts", "brioche buns", "brine",
    "brown sugar", "buckwheat flour", "buffalo mozzarella", "burrata", "calamari", "camembert cheese", "canned tomatoes",
    "cantaloupe", "caraway seeds", "cardamom pods", "cashew butter", "celery", "celery seeds", "challah", "chanterelle mushrooms",
    "cheddar cheese", "cherries", "cherry tomatoes", "chestnuts", "chili oil", "chili paste", "chive", "chocolate syrup",
    "ciabatta", "cilantro", "cinnamon stick", "clams in shell", "clotted cream", "cocoa nibs", "cod", "coffee beans",
    "cognac", "collard greens", "confectioners sugar", "cookie dough", "coriander seeds", "corn grits", "corn tortillas",
    "cottage cheese", "crab meat", "crayfish", "cream of tartar", "crème brûlée", "crostini", "crushed tomatoes",
    "crystallized ginger", "currants", "dark rum", "dates pitted", "demi-glace", "dill pickles", "dried apricots",
    "dried cranberries", "dried figs", "dried mushrooms", "dried pasta", "dried shiitake mushrooms", "dried tomatoes",
    "duck fat", "edamame", "elderflower syrup", "empanada dough", "endive", "english muffin", "espresso powder",
    "farfalle", "fava beans", "fig jam", "filet mignon", "fish stock", "focaccia", "fontina cheese", "frangipane",
    "fresh basil", "fresh chives", "fresh dill", "fresh ginger", "fresh mint", "fresh rosemary", "fresh thyme",
    "feta cheese", "flank steak", "flatbread", "fleur de sel", "fondant", "frisée", "fruit cocktail", "garbanzo beans",
    "garlic powder", "gelatin powder", "gingersnap cookies", "goat cheese", "golden syrup", "gorgonzola", "graham crackers",
    "grain mustard", "grand marnier", "grapefruit", "green cardamom", "green olives", "green onions", "gruyere cheese",
    "guava", "haddock", "halibut", "harissa", "hearts of palm", "heirloom tomatoes", "herbes de provence", "hoisin sauce",
    "hollandaise sauce", "horseradish", "hot dogs", "ice cream cones", "instant coffee", "irish cream", "jaggery",
    "jalapeño", "jicama", "juniper berries", "kabob skewers", "kalamata olives", "kasha", "kielbasa", "kimchi base",
    "king crab", "kohlrabi", "kumquats", "labneh", "lardon", "lavender", "leeks", "lemongrass", "lemon zest",
    "licorice root", "lima beans", "liquid smoke", "lo mein noodles", "long grain rice", "lox", "macadamia nuts",
    "mace", "malt vinegar", "mango", "manchego cheese", "maraschino cherries", "margarine", "marjoram", "marmite",
    "masa harina", "mascarpone", "medjool dates", "melon seeds", "meringue", "millet", "mirabelle plums", "miso paste",
    "mochi", "monkfish", "morel mushrooms", "mortadella", "muesli", "mung beans", "mushroom broth", "mussels steamed",
    "nectarines", "nigella seeds", "nutritional yeast", "oat flour", "oat groats", "okra pods", "old bay seasoning",
    "oxtail", "oyster sauce", "oysters", "palm sugar", "pancakes", "panela", "pangasius", "pappardelle",
    "parsnips", "passion fruit", "pâté", "peach preserves", "pear", "pecan nuts", "penne pasta", "peppercorns",
    "peppermint extract", "persian cucumbers", "pesto", "pheasant", "phylo dough", "picholine olives", "pickled ginger",
    "pickling spice", "pimento", "pine nuts", "pink peppercorns", "pinto beans", "plantain", "plum", "polenta instant",
    "pomegranate seeds", "porcini mushrooms", "pork belly", "pork loin", "port wine", "portobello mushrooms", "potato starch",
    "poultry seasoning", "prosciutto di parma", "prunes", "puff pastry sheets", "pumpkin", "pumpkin seeds", "quail eggs",
    "quince", "radicchio", "raisins", "ramen noodles", "rambutan", "red beans", "red cabbage", "red onion",
    "red wine vinegar", "rhubarb", "rib eye steak", "ricotta cheese", "rigatoni", "rocket arugula", "roe", "romaine lettuce",
    "rosemary fresh", "rosemary dried", "rosewater", "roux", "rye flour", "sablefish", "sake", "salmon fillets",
    "salsa verde", "sardines in oil", "sauerkraut", "scallions", "scotch bonnet pepper", "sea salt flakes", "sea scallops",
    "sesame oil", "sesame paste", "shallots", "shiitake mushrooms", "shortbread cookies", "shortcrust pastry", "shrimp cooked",
    "silken tofu", "smoked paprika", "smoked salmon", "snap peas", "sourdough bread", "soy sauce light", "soy sauce dark",
    "spelt flour", "spicy sausage", "star anise", "steel-cut oats", "stinging nettle", "strawberries fresh", "string beans",
    "sugar snap peas", "sumac", "sweet potato", "swiss chard", "swordfish", "tahini paste", "tamarind paste", "tapioca starch",
    "tarragon", "tartar sauce", "tempura flour", "teriyaki sauce", "texturized vegetable protein", "thyme fresh", "thyme dried",
    "tilapia", "tofu firm", "tofu soft", "tomatillos", "top sirloin steak", "tortellini", "truffle oil", "truffles",
    "tuna canned", "turkey breast", "turkey bacon", "turnip greens", "udon noodles", "vanilla bean", "vanilla extract",
    "vegetable stock", "venison", "vermicelli", "vermouth", "wasabi paste", "water chestnuts", "watercress", "wheat berries",
    "wheat flour", "white beans", "white chocolate chips", "white miso", "white pepper", "white vinegar", "wild rice",
    "winter squash", "wonton wrappers", "xanthan gum", "yams", "yellow mustard", "yellow onions", "yuzu juice",
    "za'atar", "ziti", "zucchini blossoms", "basmati rice", "jasmine rice", "arborio rice", "brown rice", "wild rice blend",
    "quinoa tri-color", "millet flakes", "bulgur coarse", "bulgur fine", "fregola", "orzo", "risotto rice",
    "kasha (roasted buckwheat)", "spelt berries", "farro perlato", "teff", "sorghum", "amaranth grain", "puy lentils",
    "beluga lentils", "french green lentils", "brown lentils", "yellow lentils", "black chickpeas", "fava beans dried",
    "split peas green", "split peas yellow", "navy beans", "cannellini beans", "kidney beans dried", "black-eyed peas",
    "pinto beans dried", "lima beans dried", "adzuki beans", "mung beans dried", "soybeans dried", "great northern beans",
    "chickpea flour (besan)", "tapioca flour", "rice flour", "potato flour", "almond flour", "coconut flour",
    "buckwheat groats", "corn grits (polenta)", "cream of wheat", "couscous pearl", "freekeh", "kamut",
    "flaxseed meal", "psyllium husk", "wheat germ", "brewer's yeast", "nutritional yeast flakes",
    "xanthan gum", "guar gum", "agar-agar flakes", "carrageenan", "locust bean gum",
    "stevia", "erythritol", "xylitol", "monk fruit sweetener", "Splenda", "Equal", "Sweet'N Low",
    "demerara sugar", "turbinado sugar", "muscovado sugar", "powdered sugar (icing sugar)", "rock sugar",
    "golden caster sugar", "brown rice syrup", "date syrup", "rice malt syrup", "corn syrup", "glucose syrup",
    "invert sugar", "fructose", "dextrose", "maltodextrin", "liquid glucose",
    "apple butter", "pear butter", "plum butter", "fig butter", "pumpkin butter",
    "hazelnut spread", "almond butter", "cashew butter", "peanut butter crunchy", "peanut butter smooth",
    "tahini paste", "sunflower seed butter", "soy butter", "macadamia nut butter", "pistachio butter",
    "apple cider", "grape juice", "cranberry juice", "pineapple juice", "prune juice", "tomato juice",
    "vegetable juice", "carrot juice", "beet juice", "celery juice", "ginger ale", "root beer", "cream soda",
    "tonic water", "soda water", "club soda", "sparkling water", "mineral water", "distilled water", "tap water",
    "spring water", "purified water", "coconut water", "aloe vera juice", "wheatgrass juice", "pomegranate juice",
    "elderberry juice", "acai juice", "goji berry juice", "matcha powder culinary", "matcha powder ceremonial",
    "cocoa powder unsweetened", "cocoa powder Dutch-processed", "carob powder", "mesquite powder",
    "spirulina powder", "chlorella powder", "maca powder", "lucuma powder", "baobab powder",
    "whey protein concentrate", "whey protein isolate", "casein protein", "soy protein isolate", "pea protein",
    "rice protein", "hemp protein", "collagen peptides", "gelatin bovine", "gelatin porcine",
    "balsamic vinegar white", "red wine vinegar", "white wine vinegar", "champagne vinegar", "sherry vinegar",
    "rice wine vinegar seasoned", "rice wine vinegar unseasoned", "malt vinegar", "cider vinegar raw",
    "black vinegar (Chinkiang)", "rice bran oil", "grape seed oil", "peanut oil", "sesame oil toasted",
    "avocado oil", "walnut oil", "cottonseed oil", "flaxseed oil", "hemp seed oil", "pumpkin seed oil",
    "argan oil culinary", "ghee", "lard", "shortening vegetable", "shortening animal", "margarine stick",
    "margarine tub", "vegan butter", "clarified butter", "brown butter", "infused olive oil (garlic)",
    "infused olive oil (chili)", "truffle oil white", "truffle oil black", "hazelnut oil", "pistachio oil",
    "pecan oil", "macadamia nut oil", "safflower oil", "sunflower oil high oleic", "rapeseed oil",
    "mustard oil", "fenugreek seeds", "nigella seeds (kalonji)", "ajwain seeds", "caraway seeds whole",
    "celery seeds whole", "dill seeds", "fennel seeds whole", "anise seeds whole", "cumin seeds whole",
    "coriander seeds whole", "mustard seeds yellow", "mustard seeds brown", "mustard seeds black",
    "poppy seeds white", "poppy seeds black", "sesame seeds white", "sesame seeds black", "chia seeds black",
    "chia seeds white", "flax seeds whole", "flax seeds ground", "hemp seeds hulled", "psyllium seeds",
    "amaranth seeds", "quinoa seeds", "millet seeds", "sorghum seeds", "teff seeds", "gari", "fufu flour",
    "yam flour", "plantain flour", "cassava flour", "tapioca pearls small", "tapioca pearls large",
    "sago pearls", "arrowroot powder", "kuzu starch", "water chestnut flour", "mung bean starch",
    "potato starch flour", "sweet potato starch", "corn starch powder", "rice starch", "saffron threads",
    "vanilla bean whole", "vanilla bean paste", "vanilla sugar", "almond extract", "peppermint extract",
    "lemon extract", "orange extract", "rum extract", "maple extract", "butter extract", "coconut extract",
    "licorice extract", "rose water", "orange blossom water", "pandan extract", "red bean paste",
    "white bean paste", "muzzafar", "gochujang", "doenjang", "miso paste white", "miso paste red",
    "miso paste yellow", "fermented black beans", "preserved lemons", "capers in brine", "olives Kalamata pitted",
    "olives green pitted", "sun-dried tomato paste", "anchovy paste", "harissa paste", "sambal oelek",
    "chili garlic sauce", "sriracha sauce", "tabasco sauce green", "tabasco sauce original",
    "fish sauce light", "fish sauce dark", "oyster sauce", "hoisin sauce", "plum sauce",
    "duck sauce", "sweet chili sauce", "teriyaki marinade", "ponzu sauce", "mirin sweet cooking wine",
    "sake cooking wine", "rice wine Shaoxing", "soy sauce light sodium", "soy sauce dark mushroom",
    "tamari gluten-free", "liquid aminos", "coconut aminos", "worcestershire sauce vegan",
    "ketchup organic", "mustard Dijon", "mustard yellow", "mustard whole grain", "mayonnaise light",
    "mayonnaise vegan", "aioli garlic", "tahini sauce", "hummus classic", "baba ghanoush smoky",
    "tzatziki dill", "guacamole spicy", "salsa mild", "salsa medium", "salsa hot", "pico de gallo",
    "cream cheese spread", "ricotta cheese fresh", "mascarpone cheese", "feta cheese crumbled",
    "goat cheese log", "halloumi cheese", "paneer", "queso fresco", "cotija cheese", "asadero cheese",
    "provolone cheese", "fontina cheese", "muenster cheese", "emmental cheese", "comté cheese",
    "pecorino romano cheese", "grana padano cheese", "asiago cheese", "blue cheese crumbles",
    "gorgonzola cheese", "roquefort cheese", "stilton cheese", "brie cheese wheel", "camembert cheese wheel",
    "cheddar cheese sharp", "cheddar cheese mild", "mozzarella fresh", "mozzarella shredded",
    "swiss cheese slices", "colby jack cheese", "pepper jack cheese", "gouda cheese smoked",
    "gouda cheese young", "edam cheese", "havarti cheese", "limburger cheese", "cottage cheese low fat",
    "greek yogurt plain", "greek yogurt vanilla", "skyr", "quark", "creme fraiche", "sour cream light",
    "buttermilk cultured", "kefir plain", "kefir fruit", "labneh strained yogurt", "ricotta salata",
    "parmesan reggiano grated", "parmesan reggiano block", "grana padano grated", "pecorino romano grated",
    "asiago grated", "nutritional yeast flakes large", "nutritional yeast flakes small",
    "protein powder whey vanilla", "protein powder whey chocolate", "protein powder vegan vanilla",
    "protein powder vegan chocolate", "collagen powder unflavored", "gelatin powder unflavored",
    "agar-agar powder", "xanthan gum powder", "guar gum powder", "lecithin granules",
    "bee pollen granules", "spirulina tablets", "chlorella tablets", "maca powder raw",
    "cacao powder raw", "mesquite powder raw", "lucuma powder raw", "baobab powder raw",
    "wheatgrass powder", "barley grass powder", "chlorella powder organic", "spirulina powder organic",
    "hemp protein powder organic", "pea protein powder organic", "rice protein powder organic",
    "soy protein powder organic", "almond milk unsweetened", "oat milk unsweetened",
    "coconut milk beverage", "rice milk beverage", "cashew milk beverage", "soy milk unsweetened",
    "hazelnut milk unsweetened", "macadamia milk unsweetened", "quinoa milk", "hemp milk",
    "potato milk", "pea milk", "almond creamer", "oat creamer", "coconut creamer", "soy creamer",
    "whipped cream aerosol", "whipped cream dairy", "whipped cream non-dairy",
    "condensed milk sweetened", "evaporated milk unsweetened", "powdered milk",
    "buttermilk powder", "sour cream powder", "yogurt powder", "cream cheese powder",
    "cheddar cheese powder", "parmesan cheese powder", "blue cheese powder",
    "chicken bouillon cubes", "beef bouillon cubes", "vegetable bouillon cubes",
    "fish bouillon cubes", "miso paste red", "miso paste white", "dashi granules",
    "kombu dried", "bonito flakes", "seaweed nori sheets", "seaweed wakame", "seaweed kombu",
    "seaweed arame", "seaweed dulse", "seaweed hijiki", "seaweed kelp", "seaweed Irish moss",
    "olives green sliced", "olives black sliced", "capers non-pareil", "capers large",
    "artichoke hearts marinated", "artichoke hearts canned", "sun-dried tomatoes oil-packed",
    "sun-dried tomatoes dry", "roasted red peppers jarred", "pickled onions", "pickled cucumbers",
    "pickled jalapeños", "pickled okra", "pickled beets", "pickled carrots", "pickled cauliflower",
    "kimchi napa cabbage", "kimchi radish", "sauerkraut raw", "sauerkraut pasteurized",
    "cornichons", "gherkins", "dill pickles spears", "dill pickles slices", "sweet pickles",
    "relish sweet", "relish dill", "relish hot dog", "relish hamburger",
    "green olives stuffed", "black olives ripe", "black olives cured", "kalamata olives pitted",
    "nicoise olives", "manzanilla olives", "cerignola olives", "castelvetrano olives",
    "anchovy fillets oil-packed", "anchovy fillets salt-packed", "sardines canned in oil",
    "sardines canned in water", "tuna canned in oil", "tuna canned in water", "salmon canned",
    "smoked salmon sliced", "lox smoked salmon", "gravlax", "prosciutto sliced", "pancetta diced",
    "bacon slices thick-cut", "bacon slices thin-cut", "salami Genoa", "salami Hard",
    "pepperoni slices", "chorizo Spanish", "chorizo Mexican", "andouille sausage",
    "bratwurst sausage", "frankfurter sausage", "hot dog sausage", "breakfast sausage links",
    "breakfast sausage patties", "ground pork", "ground turkey", "ground lamb", "ground veal",
    "ground bison", "ground venison", "beef stew meat", "beef chuck roast", "beef brisket flat",
    "beef brisket point", "beef short ribs bone-in", "beef short ribs boneless", "beef tenderloin",
    "beef sirloin steak", "beef flank steak", "beef skirt steak", "beef hanger steak",
    "beef rib eye steak bone-in", "beef rib eye steak boneless", "beef porterhouse steak",
    "beef t-bone steak", "beef top round", "beef bottom round", "beef eye of round",
    "lamb chops loin", "lamb chops rib", "lamb shoulder roast", "lamb leg roast",
    "pork chops bone-in", "pork chops boneless", "pork loin roast", "pork tenderloin",
    "pork shoulder butt", "pork picnic shoulder", "pork spare ribs", "pork baby back ribs",
    "chicken breast boneless skinless", "chicken breast bone-in skin-on",
    "chicken thighs boneless skinless", "chicken thighs bone-in skin-on",
    "chicken drumsticks", "chicken wings", "whole chicken", "chicken ground",
    "turkey breast whole", "turkey ground lean", "turkey ground regular", "turkey sausage",
    "duck breast", "duck confit", "duck fat rendered", "goose whole", "quail whole",
    "rabbit whole", "venison tenderloin", "venison roast", "bison steak", "wild boar meat",
    "foie gras", "pate de campagne", "rillettes", "black pudding", "white pudding",
    "haggis", "blood sausage", "liver sausage", "braunschweiger", "head cheese",
    "tripe honeycomb", "oxtail pieces", "beef tongue", "beef heart", "chicken liver",
    "chicken gizzards", "duck liver", "foie gras torchon", "escargots canned", "frog legs",
    "caviar black", "caviar red", "trout roe", "salmon roe", "herring roe", "bottarga",
    "sea urchin roe", "crab legs king", "crab legs snow", "lobster tail", "lobster whole",
    "shrimp raw peeled deveined", "shrimp cooked peeled", "prawns jumbo", "scallops sea",
    "scallops bay", "mussels fresh", "clams fresh", "oysters fresh", "calamari rings",
    "octopus tentacles", "squid tubes", "fish fillets cod", "fish fillets haddock",
    "fish fillets tilapia", "fish fillets salmon", "fish fillets halibut",
    "fish fillets mahi-mahi", "fish fillets snapper", "fish fillets grouper",
    "whole fish trout", "whole fish sea bass", "whole fish red snapper",
    "smoked haddock", "smoked mackerel", "smoked trout", "smoked cod",
    "salted cod", "dried salted cod", "tapioca pudding", "rice pudding", "sago pudding",
    "bread pudding", "chocolate pudding", "vanilla pudding", "butterscotch pudding",
    "sticky toffee pudding", "christmas pudding", "yorkshire pudding",
    "lemon meringue pie", "apple pie", "cherry pie", "pecan pie", "pumpkin pie",
    "key lime pie", "chocolate cream pie", "banana cream pie", "coconut cream pie",
    "blueberry pie", "strawberry rhubarb pie", "peach cobbler", "apple crumble",
    "berry crumble", "rhubarb crumble", "eton mess", "trifle english", "tiramisu",
    "pavlova", "creme brulee", "panna cotta", "mousse chocolate", "mousse fruit",
    "soufflé cheese", "soufflé chocolate", "lava cake", "cupcakes vanilla",
    "cupcakes chocolate", "cupcakes red velvet", "cupcakes carrot",
    "muffins blueberry", "muffins chocolate chip", "muffins bran", "muffins corn",
    "scones plain", "scones fruit", "biscuits buttermilk", "biscuits cheddar",
    "cookies chocolate chip", "cookies oatmeal raisin", "cookies peanut butter",
    "cookies sugar", "cookies shortbread", "cookies snickerdoodle",
    "brownies fudge", "brownies cakey", "blondies", "lemon bars", "pecan bars",
    "oatmeal bars", "granola bars homemade", "fruit crisp", "fruit cobbler",
    "compote berry", "compote apple", "compote pear", "jam strawberry",
    "jam raspberry", "jam blueberry", "jam apricot", "jam fig", "jam plum",
    "marmalade orange", "marmalade lemon", "marmalade grapefruit",
    "granita lemon", "granita coffee", "granita watermelon", "sorbet raspberry",
    "sorbet lemon", "sorbet mango", "ice cream vanilla bean", "ice cream chocolate fudge",
    "ice cream strawberry swirl", "ice cream mint chip", "ice cream cookie dough",
    "gelato pistachio", "gelato hazelnut", "gelato stracciatella",
    "frozen yogurt plain", "frozen yogurt fruit", "coconut flakes shredded",
    "coconut flakes toasted", "shredded coconut unsweetened", "shredded coconut sweetened",
    "coconut butter", "coconut flour fine", "coconut flour coarse",
    "almond meal", "almond flour blanched", "almond flour unblanched",
    "oat flour gluten-free", "rye flour dark", "rye flour light", "spelt flour whole",
    "buckwheat flour light", "buckwheat flour dark", "amaranth flour",
    "quinoa flour", "teff flour", "sorghum flour", "millet flour", "cornmeal fine",
    "cornmeal medium", "cornmeal coarse", "masa harina de maiz", "masa harina de trigo",
    "gluten-free all-purpose flour blend", "tapioca starch (flour)",
    "arrowroot starch (powder)", "potato starch (powder)", "sweet potato starch (powder)",
    "kuzu starch (powder)", "water chestnut starch (flour)",
    "mung bean starch (flour)", "rice starch (flour)", "semolina fine", "semolina coarse",
    "farina", "cream of rice", "cream of wheat farina", "grits instant", "grits quick", "grits stone-ground",
    "polenta instant", "polenta coarse", "polenta fine", "corn grits coarse",
    "popcorn kernels unpopped", "popcorn popped", "pretzels hard", "pretzels soft",
    "baguette", "ciabatta bread", "focaccia bread", "sourdough loaf", "rye bread",
    "pumpernickel bread", "pita bread whole wheat", "pita bread white",
    "naan bread plain", "naan bread garlic", "chapati", "roti", "tortilla corn",
    "tortilla flour", "burrito wraps", "taco shells hard", "taco shells soft",
    "wonton wrappers round", "wonton wrappers square", "spring roll wrappers rice paper",
    "spring roll wrappers wheat", "dumpling wrappers round", "dumpling wrappers square",
    "phyllo dough frozen", "puff pastry frozen sheets", "shortcrust pastry frozen",
    "pizza dough fresh", "pizza dough frozen", "pie crust refrigerated",
    "pie crust frozen", "biscuit dough refrigerated", "crescent roll dough refrigerated",
    "croissant dough refrigerated", "cinnamon roll dough refrigerated",
    "bread crumbs panko", "bread crumbs seasoned", "bread crumbs plain",
    "croutons garlic herb", "croutons plain", "oats rolled", "oats quick-cooking",
    "oats steel-cut", "oatmeal instant", "oatmeal quick-cooking", "oatmeal steel-cut",
    "cereal corn flakes", "cereal rice krispies", "cereal cheerios", "cereal frosted flakes",
    "granola oats and honey", "granola fruit and nut", "muesli bircher", "muesli toasted",
    "corn flakes crushed", "rice krispies crushed", "cheerios crushed",
    "graham cracker crumbs", "oreo cookie crumbs", "digestive biscuit crumbs",
    "ladyfingers", "sponge cake layers", "genoise cake", "chiffon cake", "angel food cake",
    "bundt cake", "pound cake", "fruit cake", "gingerbread cake", "coffee cake",
    "lava cake mix", "brownie mix", "cookie mix", "muffin mix", "cupcake mix",
    "pancake mix", "waffle mix", "crepe mix", "doughnut mix", "eclair mix",
    "choux pastry mix", "macaron mix", "meringue mix", "frosting vanilla",
    "frosting chocolate", "frosting cream cheese", "frosting royal icing",
    "fondant rolled", "gumpaste", "marzipan", "chocolate syrup dark",
    "chocolate syrup milk", "caramel sauce homemade", "caramel sauce jarred",
    "butterscotch sauce", "hot fudge sauce", "strawberry sauce", "raspberry sauce",
    "blueberry sauce", "cherry sauce", "apple sauce unsweetened", "apple sauce sweetened",
    "pear sauce", "peach sauce", "apricot sauce", "plum sauce",
    "maple syrup pure", "maple syrup blend", "pancake syrup", "golden syrup light",
    "golden syrup dark", "molasses blackstrap", "molasses light", "molasses dark",
    "honey raw", "honey clover", "honey wildflower", "honey buckwheat",
    "agave nectar light", "agave nectar dark", "corn syrup light", "corn syrup dark",
    "glucose syrup liquid", "invert sugar syrup", "fructose crystalline",
    "dextrose powder", "maltodextrin powder", "stevia liquid", "stevia powder",
    "erythritol granular", "xylitol granular", "monk fruit liquid", "monk fruit powder",
    "sucralose liquid", "sucralose powder", "aspartame tablets", "saccharin tablets",
    "coffee beans whole", "coffee beans ground", "instant coffee powder",
    "espresso beans whole", "espresso ground", "decaffeinated coffee",
    "green tea leaves loose", "green tea bags", "black tea leaves loose",
    "black tea bags", "oolong tea", "white tea", "pu-erh tea", "herbal tea chamomile",
    "herbal tea peppermint", "herbal tea ginger", "herbal tea hibiscus",
    "herbal tea rooibos", "chai tea bags", "chai tea concentrate", "matcha powder culinary grade",
    "matcha powder ceremonial grade", "cocoa powder hot chocolate mix",
    "cola soda", "lemonade concentrate", "orange juice pulp free", "orange juice with pulp",
    "apple juice clear", "apple juice cloudy", "grape juice red", "grape juice white",
    "cranberry juice cocktail", "cranberry juice pure", "pineapple juice canned",
    "pineapple juice fresh", "tomato juice low sodium", "vegetable juice blend",
    "carrot juice fresh", "beet juice fresh", "celery juice fresh",
    "ginger ale regular", "ginger ale diet", "root beer regular", "root beer diet",
    "cream soda regular", "cream soda diet", "tonic water regular", "tonic water diet",
    "soda water plain", "club soda plain", "sparkling water flavored",
    "mineral water carbonated", "distilled water bottled", "spring water bottled",
    "purified water bottled", "coconut water unsweetened", "coconut water sweetened",
    "aloe vera juice pulp", "aloe vera juice no pulp", "wheatgrass juice fresh",
    "pomegranate juice pure", "elderberry juice concentrate", "acai juice concentrate",
    "goji berry juice concentrate", "smoothie mix berry", "smoothie mix tropical",
    "protein powder vanilla whey", "protein powder chocolate whey",
    "protein powder vegan unflavored", "protein powder vegan vanilla",
    "protein powder vegan chocolate", "collagen peptides unflavored",
    "gelatin unflavored bovine", "gelatin unflavored porcine",
    "beetroot powder", "spinach powder", "kale powder", "broccoli powder",
    "carrot powder", "pumpkin powder", "sweet potato powder", "tomato powder",
    "onion powder granulated", "garlic powder granulated", "ginger powder ground",
    "turmeric powder ground", "cumin powder ground", "coriander powder ground",
    "paprika smoked", "paprika sweet", "paprika hot", "chili powder blend",
    "cayenne pepper ground", "red pepper flakes crushed", "black pepper ground",
    "white pepper ground", "green peppercorns brine", "pink peppercorns whole",
    "sichuan peppercorns", "allspice ground", "allspice berries whole",
    "anise seed whole", "star anise whole", "cardamom pods green",
    "cardamom pods black", "cardamom ground", "cinnamon sticks cassia",
    "cinnamon sticks ceylon", "cinnamon ground", "cloves whole", "cloves ground",
    "nutmeg whole", "nutmeg ground", "mace ground", "bay leaves whole",
    "mustard seeds yellow whole", "mustard seeds brown whole",
    "fenugreek seeds whole", "fenugreek leaves dried (kasoori methi)",
    "dill seeds whole", "fennel seeds whole", "caraway seeds whole",
    "celery seeds whole", "coriander seeds whole", "cumin seeds whole",
    "nigella seeds (kalonji) whole", "poppy seeds blue", "poppy seeds white",
    "sesame seeds white hulled", "sesame seeds black unhulled",
    "sesame seeds toasted", "saffron threads high quality", "saffron threads standard",
    "curry powder mild", "curry powder hot", "garam masala", "tandoori masala",
    "ras el hanout", "baharat", "za'atar blend", "herbes de provence blend",
    "italian seasoning blend", "poultry seasoning blend", "old bay seasoning blend",
    "five spice powder", "cajun seasoning", "creole seasoning", "chili lime seasoning",
    "lemon pepper seasoning", "garlic salt", "onion salt", "celery salt",
    "smoked salt", "himalayan pink salt coarse", "himalayan pink salt fine",
    "sea salt flakes", "kosher salt coarse", "kosher salt fine", "table salt iodized",
    "table salt non-iodized", "black salt (kala namak)", "pickling salt",
    "liquid smoke hickory", "liquid smoke mesquite", "vanilla extract pure",
    "almond extract pure", "peppermint extract pure", "lemon extract pure",
    "orange extract pure", "rum extract pure", "maple extract pure",
    "butter extract pure", "coconut extract pure", "licorice extract pure",
    "rose water pure", "orange blossom water pure", "pandan extract pure",
    "red food coloring", "blue food coloring", "green food coloring", "yellow food coloring",
    "black food coloring", "white food coloring", "gel food coloring",
    "liquid food coloring", "food coloring spray", "edible glitter",
    "edible pearls", "sugar sprinkles assorted", "chocolate sprinkles",
    "rainbow sprinkles", "nonpareils", "sanding sugar colored",
    "raw sugar turbinado", "brown sugar light", "brown sugar dark",
    "confectioners sugar (powdered sugar)", "caster sugar", "demerara sugar",
    "rock candy sugar", "sugar cubes", "sweetener packets",
    "baking soda pure", "baking powder double acting", "cream of tartar pure",
    "yeast active dry", "yeast instant", "yeast fresh cake", "sourdough starter active",
    "vinegar white distilled", "vinegar apple cider unfiltered", "vinegar apple cider filtered",
    "vinegar red wine", "vinegar white wine", "vinegar balsamic aged",
    "vinegar balsamic white", "vinegar champagne", "vinegar sherry",
    "vinegar rice wine seasoned", "vinegar rice wine unseasoned",
    "vinegar black (chinkiang)", "vinegar malt", "capers non-pareil drained",
    "capers large drained", "pickles dill slices", "pickles dill whole",
    "pickles sweet slices", "pickles sweet whole", "relish sweet chopped",
    "relish dill chopped", "olives green pitted", "olives black pitted",
    "kalamata olives whole", "nicoise olives pitted", "manzanilla olives stuffed",
    "castelvetrano olives pitted", "sun-dried tomatoes in oil", "sun-dried tomatoes dry-packed",
    "artichoke hearts marinated in oil", "artichoke hearts canned in water",
    "roasted red peppers in jar", "roasted red peppers fresh",
    "cornichons mini pickles", "gherkins small pickles",
    "harissa paste hot", "harissa paste mild", "sambal oelek chili paste",
    "gochujang korean chili paste", "doenjang korean soybean paste",
    "miso paste white sweet", "miso paste yellow savory", "miso paste red robust",
    "tamari gluten-free soy sauce", "liquid aminos coconut alternative",
    "coconut aminos soy sauce alternative", "fish sauce anchovy based",
    "oyster sauce savory", "hoisin sauce sweet savory", "plum sauce sweet",
    "duck sauce sweet sour", "sweet chili sauce medium", "teriyaki marinade sauce",
    "ponzu sauce citrus soy", "mirin sweet rice wine", "sake cooking wine dry",
    "rice wine shaoxing Chinese", "soy sauce light standard", "soy sauce dark thick",
    "worcestershire sauce original", "worcestershire sauce vegan",
    "ketchup classic", "mustard dijon creamy", "mustard yellow mild",
    "mustard whole grain tangy", "mayonnaise regular", "mayonnaise light",
    "mayonnaise vegan", "aioli garlic mayo", "tahini sesame paste",
    "hummus chickpea dip", "baba ghanoush eggplant dip", "tzatziki cucumber yogurt dip",
    "guacamole avocado dip", "salsa tomato based mild", "salsa tomato based medium",
    "salsa tomato based hot", "pico de gallo fresh salsa",
    "cream cheese block", "cream cheese spreadable", "ricotta cheese whole milk",
    "ricotta cheese part-skim", "mascarpone cheese creamy", "feta cheese crumbled brined",
    "goat cheese soft log", "halloumi cheese grilling", "paneer indian cheese",
    "queso fresco crumbling", "cotija cheese grating", "asadero cheese melting",
    "provolone cheese slices", "fontina cheese melting", "muenster cheese mild",
    "emmental cheese nutty", "comté cheese aged", "pecorino romano grating",
    "grana padano grating", "asiago cheese mild", "asiago cheese aged",
    "blue cheese crumbles pungent", "gorgonzola cheese mild creamy",
    "roquefort cheese strong", "stilton cheese rich", "brie cheese soft",
    "camembert cheese soft", "cheddar cheese sharp aged", "cheddar cheese mild young",
    "mozzarella fresh ball", "mozzarella shredded low-moisture",
    "swiss cheese sliced", "colby jack cheese block", "pepper jack cheese spicy",
    "gouda cheese smoked block", "gouda cheese young slices", "edam cheese ball",
    "havarti cheese creamy", "limburger cheese strong aroma",
    "cottage cheese small curd", "cottage cheese large curd",
    "greek yogurt plain full-fat", "greek yogurt plain non-fat",
    "skyr icelandic yogurt", "quark soft cheese", "creme fraiche tangy cream",
    "sour cream regular", "sour cream light", "buttermilk cultured liquid",
    "kefir plain drink", "kefir fruit flavored", "labneh strained yogurt dip",
    "ricotta salata aged firm", "parmesan reggiano grated fresh",
    "parmesan reggiano block aged", "grana padano grated fresh",
    "pecorino romano grated fresh", "asiago grated fresh"
];
let malzemeler = [];

const input = document.getElementById("ingredientInput");
const autocompleteList = document.getElementById("autocompleteList");

input.addEventListener("input", () => {
    const deger = input.value.toLowerCase();
    autocompleteList.innerHTML = "";
    if (!deger) {
        autocompleteList.classList.add("hidden");
        return;
    }

    const eslesenler = malzemeListesi.filter((malzeme) => malzeme.startsWith(deger)).slice(0, 5);
    if (eslesenler.length === 0) {
        autocompleteList.classList.add("hidden");
        return;
    }

    eslesenler.forEach((malzeme) => {
        const li = document.createElement("li");
        li.textContent = malzeme;
        li.className = "cursor-pointer px-4 py-2 hover:bg-orange-100 text-sm sm:text-base";
        li.addEventListener("click", () => {
            input.value = malzeme;
            autocompleteList.classList.add("hidden");
            input.focus();
        });
        autocompleteList.appendChild(li);
    });
    autocompleteList.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.classList.add("hidden");
    }
});

function malzemeEkle() {
    const malzeme = input.value.trim().toLowerCase();
    if (!malzeme) return;
    if (!malzemeListesi.includes(malzeme)) {
        alert("Lütfen listeden uygun malzemeyi seçin veya doğru yazdığınızdan emin olun.");
        return;
    }
    if (malzemeler.includes(malzeme)) {
        alert("Bu malzeme zaten eklendi.");
        return;
    }
    malzemeler.push(malzeme);
    malzemeGoster();
    input.value = "";
    document.getElementById("tarifBulBtn").disabled = false;
    autocompleteList.classList.add("hidden");
}

function malzemeSil(index) {
    malzemeler.splice(index, 1);
    malzemeGoster();
    if (malzemeler.length === 0) {
        document.getElementById("tarifBulBtn").disabled = true;
    }
}

function malzemeGoster() {
    const container = document.getElementById("malzemeEtiketleri");
    container.innerHTML = "";
    malzemeler.forEach((m, i) => {
        const etiket = document.createElement("div");
        etiket.className = "flex items-center bg-orange-500 text-white px-3 py-1 rounded-full cursor-pointer select-none text-sm sm:text-base";
        etiket.innerHTML = `
                    ${m}
                    <button onclick="malzemeSil(${i})" class="ml-2 text-white hover:text-gray-200 focus:outline-none">
                        <i class="fas fa-times"></i>
                    </button>`;
        container.appendChild(etiket);
    });
}

async function tarifleriBul() {
    if (malzemeler.length === 0) return;
    const sonucContainer = document.getElementById("malzemeSonuclar");
    sonucContainer.innerHTML = `
                <div class="col-span-3 text-center py-8 text-orange-500 text-xl sm:text-2xl">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p class="mt-4">Malzemelerinize uygun tarifler aranıyor...</p>
                </div>`;

    try {
        const apiKey = "92ed44c814c441c38cc63c53fd3bf901";
        const malzemeString = malzemeler.join(",");
        const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(malzemeString)}&number=6&apiKey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("API isteği başarısız");

        const data = await res.json();
        tarifleriGoster(data);
    } catch (err) {
        sonucContainer.innerHTML = `
                    <div class="col-span-3 text-center py-8 text-red-500 text-sm sm:text-base">
                        <i class="fas fa-exclamation-triangle text-2xl sm:text-3xl"></i>
                        <p class="mt-4">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                    </div>`;
        console.error(err);
    }
}

function tarifleriGoster(tarifler) {
    const sonucContainer = document.getElementById("malzemeSonuclar");
    sonucContainer.innerHTML = "";
    if (!tarifler || tarifler.length === 0) {
        sonucContainer.innerHTML = `
                    <div class="col-span-3 text-center py-8 text-gray-500 text-sm sm:text-base">
                        <i class="fas fa-utensils text-2xl sm:text-3xl"></i>
                        <p class="mt-4">Bu malzemelerle yapılabilecek tarif bulunamadı.</p>
                    </div>`;
        return;
    }

    tarifler.forEach((tarif) => {
        const kart = document.createElement("div");
        kart.className = "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow";
        kart.innerHTML = `
                    <img src="${tarif.image || "https://via.placeholder.com/300x200?text=Resim+Yok"}" alt="${tarif.title}" class="w-full h-40 sm:h-48 object-cover" />
                    <div class="p-4 sm:p-6">
                        <h3 class="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">${tarif.title}</h3>
                        <p class="text-xs sm:text-sm font-medium text-gray-600">Kullanılan malzemeler: ${tarif.usedIngredients.map((i) => i.name).join(", ")}</p>
                        <p class="text-xs sm:text-sm font-medium text-gray-600">Eksik malzemeler: ${tarif.missedIngredients.map((i) => i.name).join(", ")}</p>
                        <a href="https://spoonacular.com/recipes/${tarif.title.replace(/\s+/g, "-").toLowerCase()}-${tarif.id}" target="_blank" class="inline-block mt-2 sm:mt-3 text-orange-500 font-medium hover:underline text-sm sm:text-base">
                            Tarifi Gör <i class="fas fa-external-link-alt ml-1"></i>
                        </a>
                    </div>`;
        sonucContainer.appendChild(kart);
    });
}

// Rastgele Tarifler
async function rastgeleTarifYukle() {
    const container = document.getElementById("randomTarifler");
    container.innerHTML = `
                <div class="col-span-3 text-center py-8 text-orange-500 text-xl sm:text-2xl">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p class="mt-4">Lezzetler yükleniyor...</p>
                </div>`;

    try {
        const apiKey = "92ed44c814c441c38cc63c53fd3bf901";
        const res = await fetch(`https://api.spoonacular.com/recipes/random?number=3&apiKey=${apiKey}`);
        if (!res.ok) throw new Error("API isteği başarısız");

        const data = await res.json();
        container.innerHTML = "";
        data.recipes.forEach(tarif => {
            const div = document.createElement("div");
            div.className = "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow";
            div.innerHTML = `
                        <img src="${tarif.image}" alt="${tarif.title}" class="w-full h-40 sm:h-48 object-cover" />
                        <div class="p-4 sm:p-6">
                            <h3 class="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">${tarif.title}</h3>
                            <p class="text-xs sm:text-sm text-gray-600 line-clamp-3">${tarif.summary.replace(/<[^>]*>/g, "").split(".")[0]}...</p>
                            <a href="${tarif.sourceUrl}" target="_blank" class="inline-block mt-2 sm:mt-3 text-orange-500 font-medium hover:underline text-sm sm:text-base">
                                Tarifi Gör <i class="fas fa-external-link-alt ml-1"></i>
                            </a>
                        </div>`;
            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = `
                    <div class="col-span-3 text-center py-8 text-red-500 text-sm sm:text-base">
                        <i class="fas fa-exclamation-triangle text-2xl sm:text-3xl"></i>
                        <p class="mt-4">Bir hata oluştu. Lütfen tekrar deneyin.</p>
                    </div>`;
        console.error(err);
    }
}

// Initialize
window.addEventListener("load", () => {
    guncelleSlayt();
    guncelleDotlar();
    startSlider();
    rastgeleTarifYukle();
});