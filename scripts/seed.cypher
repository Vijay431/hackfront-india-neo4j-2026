CREATE CONSTRAINT role_id IF NOT EXISTS FOR (n:Role) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (n:Skill) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT resource_id IF NOT EXISTS FOR (n:Resource) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT project_id IF NOT EXISTS FOR (n:Project) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT user_id IF NOT EXISTS FOR (n:User) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT milestone_id IF NOT EXISTS FOR (n:Milestone) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT roadmap_id IF NOT EXISTS FOR (n:Roadmap) REQUIRE n.id IS UNIQUE;

UNWIND [
  {id:'fullstack-dev', title:'Full-Stack Developer', description:'Build and ship complete web applications, from React UIs to Node APIs and databases.'},
  {id:'ml-engineer', title:'Machine Learning Engineer', description:'Train, evaluate, and deploy machine learning models in production.'},
  {id:'data-scientist', title:'Data Scientist', description:'Turn data into insight with statistics, analysis, and predictive models.'},
  {id:'software-architect', title:'Software Architect', description:'Design scalable, secure, and maintainable systems across services and clouds.'},
  {id:'ai-engineer', title:'AI Engineer', description:'Build LLM-powered products with RAG, agents, and vector search.'}
] AS r
MERGE (n:Role {id:r.id}) SET n.title = r.title, n.description = r.description;

UNWIND [
  {id:'python', name:'Python', category:'Programming', url:'https://docs.python.org/3/tutorial/'},
  {id:'javascript', name:'JavaScript', category:'Programming', url:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting'},
  {id:'typescript', name:'TypeScript', category:'Programming', url:'https://www.typescriptlang.org/docs/handbook/intro.html'},
  {id:'react', name:'React', category:'Frontend', url:'https://react.dev/learn'},
  {id:'nodejs', name:'Node.js', category:'Backend', url:'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'},
  {id:'http', name:'HTTP Fundamentals', category:'Web', url:'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'},
  {id:'rest-apis', name:'REST APIs', category:'Backend', url:'https://restfulapi.net/'},
  {id:'sql', name:'SQL', category:'Data', url:'https://www.w3schools.com/sql/'},
  {id:'databases', name:'Database Design', category:'Data', url:'https://www.postgresql.org/docs/current/ddl.html'},
  {id:'docker', name:'Docker', category:'DevOps', url:'https://docs.docker.com/get-started/'},
  {id:'git', name:'Git', category:'Tooling', url:'https://git-scm.com/book/en/v2'},
  {id:'statistics', name:'Statistics', category:'Math', url:'https://www.khanacademy.org/math/statistics-probability'},
  {id:'linear-algebra', name:'Linear Algebra', category:'Math', url:'https://www.khanacademy.org/math/linear-algebra'},
  {id:'pandas', name:'Pandas & NumPy', category:'Data', url:'https://pandas.pydata.org/docs/getting_started/index.html'},
  {id:'data-viz', name:'Data Visualization', category:'Data', url:'https://matplotlib.org/stable/tutorials/index.html'},
  {id:'ml-fundamentals', name:'Machine Learning', category:'ML', url:'https://scikit-learn.org/stable/user_guide.html'},
  {id:'deep-learning', name:'Deep Learning', category:'ML', url:'https://pytorch.org/tutorials/beginner/basics/intro.html'},
  {id:'feature-eng', name:'Feature Engineering', category:'ML', url:'https://scikit-learn.org/stable/modules/preprocessing.html'},
  {id:'mlops', name:'MLOps', category:'ML', url:'https://ml-ops.org/'},
  {id:'nlp', name:'NLP', category:'AI', url:'https://huggingface.co/learn/llm-course/chapter1/1'},
  {id:'llms', name:'LLM Fundamentals', category:'AI', url:'https://www.promptingguide.ai/introduction'},
  {id:'prompt-eng', name:'Prompt Engineering', category:'AI', url:'https://www.promptingguide.ai/'},
  {id:'vector-db', name:'Vector Databases', category:'AI', url:'https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/vector-indexes/'},
  {id:'rag', name:'RAG Architectures', category:'AI', url:'https://neo4j.com/blog/genai/what-is-graphrag/'},
  {id:'ai-agents', name:'AI Agents & Tool Use', category:'AI', url:'https://www.anthropic.com/engineering/building-effective-agents'},
  {id:'system-design', name:'System Design', category:'Architecture', url:'https://github.com/donnemartin/system-design-primer'},
  {id:'design-patterns', name:'Design Patterns', category:'Architecture', url:'https://refactoring.guru/design-patterns'},
  {id:'distributed-systems', name:'Distributed Systems', category:'Architecture', url:'https://aws.amazon.com/builders-library/'},
  {id:'microservices', name:'Microservices', category:'Architecture', url:'https://microservices.io/patterns/microservices.html'},
  {id:'cloud-arch', name:'Cloud Architecture', category:'Architecture', url:'https://aws.amazon.com/architecture/well-architected/'},
  {id:'api-design', name:'API Design', category:'Architecture', url:'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design'},
  {id:'security-arch', name:'Security Architecture', category:'Architecture', url:'https://owasp.org/www-project-top-ten/'},
  {id:'scalability', name:'Scalability', category:'Architecture', url:'https://learn.microsoft.com/en-us/azure/architecture/best-practices/auto-scaling'}
] AS s
MERGE (k:Skill {id:s.id}) SET k.name = s.name, k.category = s.category
MERGE (r:Resource {id:'res-' + s.id}) SET r.title = s.name + ' guide', r.url = s.url, r.type = 'docs', r.isFree = true
MERGE (k)-[:HAS_RESOURCE]->(r);

UNWIND [
  ['typescript','javascript'], ['react','javascript'], ['nodejs','javascript'],
  ['rest-apis','http'], ['databases','sql'],
  ['pandas','python'], ['data-viz','pandas'],
  ['ml-fundamentals','python'], ['ml-fundamentals','statistics'], ['ml-fundamentals','linear-algebra'],
  ['deep-learning','python'], ['deep-learning','ml-fundamentals'],
  ['feature-eng','pandas'], ['feature-eng','ml-fundamentals'],
  ['mlops','docker'], ['mlops','ml-fundamentals'],
  ['nlp','deep-learning'], ['llms','nlp'], ['prompt-eng','llms'],
  ['vector-db','databases'], ['rag','vector-db'], ['rag','llms'],
  ['ai-agents','llms'], ['ai-agents','rest-apis'],
  ['system-design','databases'], ['system-design','rest-apis'],
  ['distributed-systems','system-design'], ['microservices','rest-apis'], ['microservices','docker'],
  ['cloud-arch','docker'], ['cloud-arch','http'], ['api-design','rest-apis'],
  ['security-arch','http'], ['scalability','system-design']
] AS p
MATCH (a:Skill {id:p[0]}), (b:Skill {id:p[1]})
MERGE (a)-[:REQUIRES_PREREQUISITE]->(b);

UNWIND [
  ['fullstack-dev','javascript',0.9], ['fullstack-dev','typescript',0.8], ['fullstack-dev','react',1.0],
  ['fullstack-dev','nodejs',0.9], ['fullstack-dev','rest-apis',0.8], ['fullstack-dev','sql',0.7],
  ['fullstack-dev','git',0.5], ['fullstack-dev','docker',0.4],
  ['ml-engineer','python',1.0], ['ml-engineer','ml-fundamentals',1.0], ['ml-engineer','deep-learning',0.9],
  ['ml-engineer','feature-eng',0.7], ['ml-engineer','pandas',0.7], ['ml-engineer','mlops',0.8],
  ['ml-engineer','docker',0.5], ['ml-engineer','statistics',0.6],
  ['data-scientist','python',1.0], ['data-scientist','sql',0.8], ['data-scientist','statistics',1.0],
  ['data-scientist','pandas',0.9], ['data-scientist','data-viz',0.7], ['data-scientist','ml-fundamentals',0.9],
  ['data-scientist','feature-eng',0.6],
  ['software-architect','system-design',1.0], ['software-architect','design-patterns',0.8],
  ['software-architect','distributed-systems',0.9], ['software-architect','microservices',0.8],
  ['software-architect','cloud-arch',0.8], ['software-architect','api-design',0.7],
  ['software-architect','security-arch',0.7], ['software-architect','scalability',0.9],
  ['ai-engineer','python',1.0], ['ai-engineer','llms',1.0], ['ai-engineer','prompt-eng',0.7],
  ['ai-engineer','rag',0.9], ['ai-engineer','vector-db',0.8], ['ai-engineer','ai-agents',0.8],
  ['ai-engineer','nlp',0.6], ['ai-engineer','rest-apis',0.5]
] AS q
MATCH (r:Role {id:q[0]}), (s:Skill {id:q[1]})
MERGE (r)-[rel:REQUIRES_SKILL]->(s) SET rel.importanceWeight = q[2];

UNWIND [
  {id:'proj-fullstack', skill:'react', title:'Task Tracker App', description:'Ship a full-stack task tracker with a React UI, Node API, and SQL storage.', difficulty:'intermediate'},
  {id:'proj-ml', skill:'mlops', title:'Model Serving Pipeline', description:'Train a classifier and serve it from a Docker container behind an API.', difficulty:'advanced'},
  {id:'proj-ds', skill:'data-viz', title:'Exploratory Analysis Report', description:'Analyse a public dataset and publish charts plus a written findings report.', difficulty:'intermediate'},
  {id:'proj-architect', skill:'system-design', title:'URL Shortener Design Doc', description:'Write a design doc for a URL shortener covering scale, storage, and failure modes.', difficulty:'intermediate'},
  {id:'proj-ai', skill:'rag', title:'Document Q&A Bot', description:'Build a RAG chatbot over your own documents using vector search.', difficulty:'intermediate'}
] AS j
MATCH (s:Skill {id:j.skill})
MERGE (p:Project {id:j.id}) SET p.title = j.title, p.description = j.description, p.difficulty = j.difficulty
MERGE (s)-[:PRACTICED_BY]->(p);
