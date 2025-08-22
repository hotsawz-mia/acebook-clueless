const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/user");
const Post = require("./models/post"); // adjust path if needed

// Villain users
const users = [
    {
    username: "Dave",
    email: "dave@dave.com",
    password: "dave",
    profilePicture: "/uploads/dave.webp",
    backgroundPicture: "/uploads/Dave_Fam.jpeg",
    bio: "Just a dude who stumbled into destiny by accident. When he’s not perfecting sourdough, he’s mastering the art of staring contests with drying paint or adding yet another thimble to his oddly prestigious collection. A man of unusual hobbies, but impeccable timing.",
    hobbies: ["Baking", "Watching paint dry", "Collecting thimbles"],
    following: [],
    followers: []
  },
  {
    username: "Hades",
    email: "hades@underworld.com",
    password: "flames4hair",
    profilePicture: "/uploads/Hades.webp",
    backgroundPicture: "/uploads/Hades_Lair.webp",
    bio: "God of the Underworld. Fluent in sarcasm and contract law.",
    hobbies: ["souls bargaining", "flame styling", "monologuing"],
  },
  {
    username: "MojoJojo",
    email: "mojo.jojo@jojoschemes.net",
    password: "monkeybusiness",
    profilePicture: "/uploads/Mojojojo.webp",
    backgroundPicture: "/uploads/Mojojojo_Lair.webp",
    bio: "Simian super-genius bent on ruling Townsville, with impeccable repetition skills.",
    hobbies: ["world domination", "long speeches", "gadget tinkering"],
  },
  {
    username: "Plankton",
    email: "plankton@chumbucket.biz",
    password: "secretformula",
    profilePicture: "/uploads/Plankton.webp",
    backgroundPicture: "/uploads/Plankton_Lair.webp",
    bio: "1% evil, 99% hot gas. Proprietor of the Chum Bucket.",
    hobbies: ["recipe theft", "robot building", "petting Karen"],
  },
  {
    username: "LordFarquaad",
    email: "farquaad@duloc.gov",
    password: "shortking",
    profilePicture: "/uploads/LordFarquaad.webp",
    backgroundPicture: "/uploads/LordFaquaad_Lair.webp",
    bio: "Ruler of Duloc. Loves order, hates ogres.",
    hobbies: ["castle tours", "lawn grooming", "overcompensating"],
  },
  {
    username: "EvilMorty",
    email: "evilmorty@citadel.net",
    password: "oneTrueMorty",
    profilePicture: "/uploads/EvilMorty.webp",
    backgroundPicture: "/uploads/Citadel_Council.webp",
    bio: "Just another Morty… or maybe the one pulling all the strings. Believes in breaking cycles and watching Rick squirm.",
    hobbies: ["political manipulation", "theme songs", "eye patch collection"],
  },
  {
  username: "Skeletor",
  email: "skeletor@snake-mountain.org",
  password: "bonez4life",
  profilePicture: "/uploads/Skeletor.webp",
  backgroundPicture: "/uploads/SnakeMountain.webp",
  bio: "Evil Lord of Destruction. Aspiring motivational speaker. Collector of failed plans.",
  hobbies: ["yelling at minions", "plotting badly", "laughing menacingly"]
  },
  {
  username: "Aku",
  email: "aku@shapeshifting.darkness",
  password: "samuraijackwho",
  profilePicture: "/uploads/Aku.webp",
  backgroundPicture: "/uploads/Aku_Lair.webp",
  bio: "The Shapeshifting Master of Darkness. Spreader of chaos. Eternal hater of time-traveling samurais.",
  hobbies: ["evil monologues", "destroying timelines", "dramatic laughter"]
  },
  {
    username: "Ursula",
    email: "ursula@sea.witch",
    password: "tentacles",
    profilePicture: "/uploads/Ursula(TheLittleMermaid)character.png",
    backgroundPicture: "/uploads/Cavern.webp",
    bio: "Sea witch. Contract enthusiast. Voice collector.",
    hobbies: ["ink magic", "contracts", "eels"],
  },
  {
    username: "Scar",
    email: "scar@pridelands.sav",
    password: "longliveking",
    profilePicture: "/uploads/Scar_lion_king.png",
    backgroundPicture: "/uploads/priderock.webp",
    bio: "Sharp wit, sharper claws.",
    hobbies: ["scheming", "dramatic monologues", "hyena wrangling"],
  },
  {
    username: "Magneto",
    email: "magneto@brotherhood.org",
    password: "polarity",
    profilePicture: "/uploads/Magneto_(Marvel_Comics_character).jpg",
    backgroundPicture: "/uploads/Helmet.webp",
    bio: "Master of magnetism.",
    hobbies: ["metalwork", "chess", "philosophy"],
  },
  {
    username: "Loki",
    email: "loki@asgard.realm",
    password: "mischief",
    profilePicture: "/uploads/Tom_Hiddleston_by_Gage_Skidmore.jpg",
    backgroundPicture: "/uploads/asgaurd.webp",
    bio: "God of mischief. Duplicate accounts may apply.",
    hobbies: ["illusions", "daggers", "glorious purpose"],
  },
  {
    username: "Maleficent",
    email: "maleficent@moors.fae",
    password: "thorns",
    profilePicture: "/uploads/Malefica.jpg",
    backgroundPicture: "/uploads/Castle.webp",
    bio: "All about aesthetic curses.",
    hobbies: ["green fire", "spells", "ravens"],
  },
  {
    username: "Bowser",
    email: "bowser@koopaking.net",
    password: "roar123",
    profilePicture: "/uploads/Bowser_by_Shigehisa_Nakaue.png",
    backgroundPicture: "/uploads/bowsers_lair.webp",
    bio: "Koopa King. Into lava architecture.",
    hobbies: ["kidnapping practice", "kart racing", "fire breath"],
  },
  {
    username: "Thanos",
    email: "thanos@titan.space",
    password: "inevitable",
    profilePicture: "/uploads/Josh_Brolin_as_Thanos.jpeg",
    backgroundPicture: "/uploads/infinity.webp",
    bio: "Interested in balance.",
    hobbies: ["collecting", "gardening", "monologues"],
  },
  {
    username: "Joker",
    email: "joker@gotham.fun",
    password: "whyso",
    profilePicture: "/uploads/Batman_Three_Jokers.jpg",
    backgroundPicture: "/uploads/Joker.webp",
    bio: "Agent of chaos.",
    hobbies: ["cards", "tricks", "laughs"],
  },
  {
    username: "Magica",
    email: "magica@de-spell.io",
    password: "numberone",
    profilePicture: "/uploads/magica.webp",
    backgroundPicture: "/uploads/magica_lair.webp",
    bio: "Shadow and hexes.",
    hobbies: ["amulets", "alchemy", "runes"],
  },
  {
    username: "DrDoom",
    email: "doom@latveria.gov",
    password: "victor",
    profilePicture: "/uploads/Doctor_Doom_(Marvel_Comics_character).png",
    backgroundPicture: "/uploads/doomlatervia.webp",
    bio: "Science, sorcery, sovereignty.",
    hobbies: ["labs", "robots", "monarchy"],
  },
];

// Villain posts
const posts = [
  { message: "Just signed another soul contract. Easy money.", photoUrl: "/uploads/soul_contract.webp", username: "Hades"},
  { message: "Polarity reversed. Chess pieces levitate nicely.", username: "Magneto" },
  { message: "I, Mojo Jojo, WILL conquer Townsville. Again. And again.", username: "MojoJojo" },
  { message: "Humans invented metal straws. Progress.", username: "Magneto" },
  { message: "Attempt #246 to steal the Krabby Patty formula. This time for sure!", username: "Plankton" },
  { message: "Peach invited me to team racing. Suspicious.", username: "Bowser" },
  { message: "Duloc will be spotless... or else.", photoUrl: "/uploads/Duloc.webp",  username: "LordFarquaad" },
  { message: "Latveria skyline improvements approved by Doom.", photoUrl: "/uploads/Latervia.webp", username: "DrDoom" },
  { message: "Anyone know a good stylist for fire hair? Asking for a friend. That friend is me.", username: "Hades" },
  { message: "Shell day at the gym.", photoUrl: "/uploads/squats.webp", username: "Bowser" },
  { message: "If you're good at something, never do it for free.", username: "Joker" },
  { message: "Mojo Jojo does NOT approve of the city's new zoning laws!", username: "MojoJojo" },
  { message: "Trying a new cauldron glaze: abyssal black.", photoUrl: "/uploads/couldron.webp", username: "Ursula" },
  { message: "Built a new chum-based dessert. Karen says it's 'inedible'. Rude.", username: "Plankton" },
  { message: "Duplicate me says hi.", username: "Loki" },
  { message: "Auditioning knights to rescue princesses I have yet to kidnap.", photoUrl: "/uploads/audition.webp", username: "LordFarquaad" },
  { message: "Hyena HR is a thing now.", username: "Scar" },
  { message: "Thinking about redecorating the Underworld. Maybe more lava.", username: "Hades" },
  { message: "New scarecrow harvest successful.", username: "Thanos" },
  { message: "Just another day at the Citadel. Funny how nobody notices who's really pulling the strings. 😉", photoUrl: "/uploads/rick.webp", username: "EvilMorty"},
  { message: "Beat the paint in a staring contest. Again.", photoUrl: "/uploads/paint.webp", username: "Dave" },
  { message: "Curses! Another brilliant plan foiled… by children. AGAIN. 😤", photoUrl: "/uploads/SnakeMountain2.webp", username: "Skeletor"},
  { message: "Rearranged the railways. Efficient.", username: "Magneto" },
  { message: "One day, He-Man… ONE DAY! Until then, I shall practice my evil laugh. MWAHAHAHA!", photoUrl: "/uploads/haha.webp", username: "Skeletor"},
  { message: "New eel enrichment: laser pointer.", username: "Ursula" },
  { message: "Long ago in a distant land, I unleashed an unspeakable evil. And yet… here I am, still waiting for my five-star rating. 😈", photoUrl: "/uploads/Aku_Lair.webp", username: "Aku"},
  { message: "Long live me.", username: "Scar" },
  { message: "Why so serious? Meetings again.", photoUrl: "/uploads/smile.webp", username: "Joker" },
  { message: "Why conquer ONE world when you can conquer ALL timelines? Multiversal domination just hits different. 🔥", username: "Aku"},
  { message: "Sourdough starter is sentient now. Calls me 'Master'.", username: "Dave" },
  { message: "Memo: raise mirror budget by 300%.", photoUrl: "/uploads/mirror.webp", username: "LordFarquaad" },
  { message: "A forest of thorns for the uninvited.", photoUrl: "/uploads/thorns.webp", username: "Maleficent" },
  { message: "Victor tests Doombot v9.3. Acceptable.", username: "DrDoom" },
  { message: "Parchment inventory low. Hexes up.", photoUrl: "/uploads/paperthorns.webp", username: "Magica" },
  { message: "Thimble #217 acquired. A rare left-handed model.", photoUrl: "/uploads/thimble.webp", username: "Dave" },
  { message: "Poor unfortunate souls keep signing. Business is good.", username: "Ursula" },
  { message: "Hyena HR is a thing now.", username: "Scar" },
  { message: "Grateful for a quiet garden.", photoUrl: "/uploads/garden.webp", username: "Thanos" },
  { message: "Rearranged the railways. Efficient.", username: "Magneto" },
  { message: "I am burdened with glorious purpose.", username: "Loki" },
  { message: "New illusion: paperwork that completes itself.", photoUrl: "/uploads/pen.webp", username: "Loki" },
  { message: "Green fire pairs well with twilight.", photoUrl: "/uploads/greenfire.webp", username: "Maleficent" },
  { message: "Curses, but make it couture.", username: "Maleficent" },
  { message: "Peach invited me to team racing. Suspicious.", username: "Bowser" },
  { message: "New lava moats complete. OSHA can’t stop me.", username: "Bowser" },
  { message: "Rune alignment perfect at midnight.", username: "Magica" },
  { message: "Balance requires effort.", username: "Thanos" },
  { message: "Card trick went boom.", username: "Joker" },
  { message: "One coin to rule them all.", username: "Magica" },
  { message: "Doom requires calibration.", username: "DrDoom" },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    // Clear old data (dev only)
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Old users and posts removed");

    // Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Villain users seeded");

    const userMap = {};
    createdUsers.forEach(u => { userMap[u.username] = u._id; });

    // Define relationships (by username)
const relationships = [
  { username: "Dave",         following: ["Hades", "MojoJojo", "Ursula", "Magica"], followers: ["Hades", "MojoJojo"] },
  { username: "Hades",        following: ["Dave", "Ursula", "Maleficent", "Aku"], followers: ["Dave", "MojoJojo", "Scar", "Aku"] },
  { username: "MojoJojo",     following: ["Plankton", "Hades", "Joker", "Skeletor"], followers: ["Dave", "Plankton", "Evil Morty"] },
  { username: "Plankton",     following: ["LordFarquaad", "Bowser", "DrDoom", "Evil Morty"], followers: ["MojoJojo", "Joker"] },
  { username: "LordFarquaad", following: ["Scar", "Magneto", "DrDoom", "Skeletor"], followers: ["Plankton", "Scar", "Aku"] },
  { username: "Ursula",       following: ["Hades", "Maleficent", "Magica"], followers: ["Hades", "Dave"] },
  { username: "Scar",         following: ["LordFarquaad", "Joker", "Thanos"], followers: ["Hades", "LordFarquaad"] },
  { username: "Magneto",      following: ["DrDoom", "Thanos", "Loki"], followers: ["Scar", "DrDoom"] },
  { username: "Loki",         following: ["Thanos", "Magneto", "Maleficent"], followers: ["Magneto", "Joker"] },
  { username: "Maleficent",   following: ["Ursula", "Magica", "Loki"], followers: ["Ursula", "Hades"] },
  { username: "Bowser",       following: ["Plankton", "LordFarquaad", "Thanos"], followers: ["Plankton"] },
  { username: "Thanos",       following: ["Loki", "Magneto", "DrDoom"], followers: ["Scar", "Bowser"] },
  { username: "Joker",        following: ["MojoJojo", "Scar", "Loki"], followers: ["MojoJojo", "Plankton"] },
  { username: "Magica",       following: ["Ursula", "Maleficent", "Hades"], followers: ["Ursula", "Dave"] },
  { username: "DrDoom",       following: ["Magneto", "Thanos", "LordFarquaad"], followers: ["Magneto", "Plankton", "LordFarquaad"] },
  { username: "Evil Morty",   following: ["Hades", "Aku"], followers: ["Dave", "Plankton", "MojoJojo"] },
  { username: "Skeletor",     following: ["Aku", "LordFarquaad"], followers: ["Dave", "MojoJojo", "Aku"] },
  { username: "Aku",          following: ["Evil Morty", "Hades"], followers: ["Hades", "Skeletor", "LordFarquaad"] },
];

    // Update each user with correct references
    for (const rel of relationships) {
      await User.updateOne(
        { username: rel.username },
        {
          $set: {
            following: rel.following.map(name => userMap[name]),
            followers: rel.followers.map(name => userMap[name]),
          }
        }
      );
    }

    // Create posts linked to the right user IDs
    const postDocs = posts.map((post) => {
      const author = createdUsers.find((u) => u.username === post.username);
      return {
        message: post.message,
        photoUrl: post.photoUrl ?? null,
        user: author._id,
      };
    });

    await Post.insertMany(postDocs);
    console.log("Villain posts seeded");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDB();