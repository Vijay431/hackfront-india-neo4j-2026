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
  {id:'ai-engineer', title:'AI Engineer', description:'Build LLM-powered products with RAG, agents, and vector search.'},
  {id:'forward-deployed-engineer', title:'Forward Deployed Engineer', description:'Embed with customers to integrate data and APIs, and turn their problems into working deployments.'}
] AS r
MERGE (n:Role {id:r.id}) SET n.title = r.title, n.description = r.description;

UNWIND [
  {id:'python', name:'Python', category:'Programming', url:'https://docs.python.org/3/tutorial/', q:'python'},
  {id:'javascript', name:'JavaScript', category:'Programming', url:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting', q:'javascript'},
  {id:'typescript', name:'TypeScript', category:'Programming', url:'https://www.typescriptlang.org/docs/handbook/intro.html', q:'typescript'},
  {id:'react', name:'React', category:'Frontend', url:'https://react.dev/learn', q:'react'},
  {id:'nodejs', name:'Node.js', category:'Backend', url:'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', q:'nodejs'},
  {id:'http', name:'HTTP Fundamentals', category:'Web', url:'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', q:'http+fundamentals'},
  {id:'rest-apis', name:'REST APIs', category:'Backend', url:'https://restfulapi.net/', q:'rest+apis'},
  {id:'sql', name:'SQL', category:'Data', url:'https://www.w3schools.com/sql/', q:'sql'},
  {id:'databases', name:'Database Design', category:'Data', url:'https://www.postgresql.org/docs/current/ddl.html', q:'database+design'},
  {id:'docker', name:'Docker', category:'DevOps', url:'https://docs.docker.com/get-started/', q:'docker'},
  {id:'git', name:'Git', category:'Tooling', url:'https://git-scm.com/book/en/v2', q:'git'},
  {id:'statistics', name:'Statistics', category:'Math', url:'https://www.khanacademy.org/math/statistics-probability', q:'statistics'},
  {id:'linear-algebra', name:'Linear Algebra', category:'Math', url:'https://www.khanacademy.org/math/linear-algebra', q:'linear+algebra'},
  {id:'pandas', name:'Pandas & NumPy', category:'Data', url:'https://pandas.pydata.org/docs/getting_started/index.html', q:'pandas+numpy'},
  {id:'data-viz', name:'Data Visualization', category:'Data', url:'https://matplotlib.org/stable/tutorials/index.html', q:'data+visualization'},
  {id:'ml-fundamentals', name:'Machine Learning', category:'ML', url:'https://scikit-learn.org/stable/user_guide.html', q:'machine+learning'},
  {id:'deep-learning', name:'Deep Learning', category:'ML', url:'https://pytorch.org/tutorials/beginner/basics/intro.html', q:'deep+learning'},
  {id:'feature-eng', name:'Feature Engineering', category:'ML', url:'https://scikit-learn.org/stable/modules/preprocessing.html', q:'feature+engineering'},
  {id:'mlops', name:'MLOps', category:'ML', url:'https://ml-ops.org/', q:'mlops'},
  {id:'nlp', name:'NLP', category:'AI', url:'https://huggingface.co/learn/llm-course/chapter1/1', q:'nlp'},
  {id:'llms', name:'LLM Fundamentals', category:'AI', url:'https://www.promptingguide.ai/introduction', q:'llm+fundamentals'},
  {id:'prompt-eng', name:'Prompt Engineering', category:'AI', url:'https://www.promptingguide.ai/', q:'prompt+engineering'},
  {id:'vector-db', name:'Vector Databases', category:'AI', url:'https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/vector-indexes/', q:'vector+databases'},
  {id:'rag', name:'RAG Architectures', category:'AI', url:'https://neo4j.com/blog/genai/what-is-graphrag/', q:'rag+architectures'},
  {id:'ai-agents', name:'AI Agents & Tool Use', category:'AI', url:'https://www.anthropic.com/engineering/building-effective-agents', q:'ai+agents+tool+use'},
  {id:'system-design', name:'System Design', category:'Architecture', url:'https://github.com/donnemartin/system-design-primer', q:'system+design'},
  {id:'design-patterns', name:'Design Patterns', category:'Architecture', url:'https://refactoring.guru/design-patterns', q:'design+patterns'},
  {id:'distributed-systems', name:'Distributed Systems', category:'Architecture', url:'https://aws.amazon.com/builders-library/', q:'distributed+systems'},
  {id:'microservices', name:'Microservices', category:'Architecture', url:'https://microservices.io/patterns/microservices.html', q:'microservices'},
  {id:'cloud-arch', name:'Cloud Architecture', category:'Architecture', url:'https://aws.amazon.com/architecture/well-architected/', q:'cloud+architecture'},
  {id:'api-design', name:'API Design', category:'Architecture', url:'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design', q:'api+design'},
  {id:'security-arch', name:'Security Architecture', category:'Architecture', url:'https://owasp.org/www-project-top-ten/', q:'security+architecture'},
  {id:'scalability', name:'Scalability', category:'Architecture', url:'https://learn.microsoft.com/en-us/azure/architecture/best-practices/auto-scaling', q:'scalability'},
  {id:'html-css', name:'HTML & CSS', category:'Web', url:'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content', q:'html+css'},
  {id:'java', name:'Java', category:'Programming', url:'https://dev.java/learn/', q:'java'},
  {id:'c-cpp', name:'C / C++', category:'Programming', url:'https://www.learncpp.com/', q:'c+cpp'},
  {id:'dsa', name:'Data Structures & Algorithms', category:'Programming', url:'https://visualgo.net/en', q:'data+structures+algorithms'},
  {id:'linux', name:'Linux', category:'DevOps', url:'https://ryanstutorials.net/linuxtutorial/', q:'linux+command+line'},
  {id:'cloud-basics', name:'Cloud Basics', category:'DevOps', url:'https://aws.amazon.com/getting-started/cloud-essentials/', q:'cloud+computing+basics'},
  {id:'cicd', name:'CI/CD', category:'DevOps', url:'https://docs.github.com/en/actions/about-github-actions/understanding-github-actions', q:'ci+cd+pipeline'},
  {id:'data-pipelines', name:'Data Pipelines', category:'Data', url:'https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html', q:'data+pipelines'},
  {id:'solutions-eng', name:'Solutions Engineering', category:'Business', url:'https://en.wikipedia.org/wiki/Sales_engineering', q:'solutions+engineering'}
] AS s
MERGE (k:Skill {id:s.id}) SET k.name = s.name, k.category = s.category
MERGE (r:Resource {id:'res-' + s.id}) SET r.title = s.name + ' guide', r.url = s.url, r.type = 'docs', r.isFree = true
MERGE (k)-[:HAS_RESOURCE]->(r)
MERGE (v:Resource {id:'res-' + s.id + '-video'}) SET v.title = s.name + ' video search', v.url = 'https://www.youtube.com/results?search_query=' + s.q + '+tutorial', v.type = 'video', v.isFree = true
MERGE (k)-[:HAS_RESOURCE]->(v)
MERGE (c:Resource {id:'res-' + s.id + '-course'}) SET c.title = s.name + ' course search', c.url = 'https://www.freecodecamp.org/news/search/?query=' + s.q, c.type = 'course', c.isFree = true
MERGE (k)-[:HAS_RESOURCE]->(c)
MERGE (h:Resource {id:'res-' + s.id + '-hands-on'}) SET h.title = s.name + ' practice repos', h.url = 'https://github.com/search?q=' + s.q + '+exercises&type=repositories', h.type = 'hands-on', h.isFree = true
MERGE (k)-[:HAS_RESOURCE]->(h);

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
  ['cloud-arch','docker'], ['cloud-arch','http'], ['cloud-arch','cloud-basics'], ['api-design','rest-apis'],
  ['security-arch','http'], ['scalability','system-design'],
  ['javascript','html-css'], ['docker','linux'], ['cicd','git'],
  ['data-pipelines','python'], ['data-pipelines','sql'], ['solutions-eng','rest-apis'], ['system-design','dsa']
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
  ['ai-engineer','nlp',0.6], ['ai-engineer','rest-apis',0.5],
  ['forward-deployed-engineer','solutions-eng',1.0], ['forward-deployed-engineer','rest-apis',0.9],
  ['forward-deployed-engineer','python',0.9], ['forward-deployed-engineer','data-pipelines',0.8],
  ['forward-deployed-engineer','sql',0.8], ['forward-deployed-engineer','docker',0.7],
  ['forward-deployed-engineer','cloud-basics',0.7], ['forward-deployed-engineer','linux',0.6],
  ['forward-deployed-engineer','git',0.5], ['forward-deployed-engineer','cicd',0.5]
] AS q
MATCH (r:Role {id:q[0]}), (s:Skill {id:q[1]})
MERGE (r)-[rel:REQUIRES_SKILL]->(s) SET rel.importanceWeight = q[2];

UNWIND [
  {id:'proj-fullstack', skill:'react', title:'Task Tracker App', description:'Ship a full-stack task tracker with a React UI, Node API, and SQL storage.', difficulty:'intermediate'},
  {id:'proj-ml', skill:'mlops', title:'Model Serving Pipeline', description:'Train a classifier and serve it from a Docker container behind an API.', difficulty:'advanced'},
  {id:'proj-ds', skill:'data-viz', title:'Exploratory Analysis Report', description:'Analyse a public dataset and publish charts plus a written findings report.', difficulty:'intermediate'},
  {id:'proj-architect', skill:'system-design', title:'URL Shortener Design Doc', description:'Write a design doc for a URL shortener covering scale, storage, and failure modes.', difficulty:'intermediate'},
  {id:'proj-ai', skill:'rag', title:'Document Q&A Bot', description:'Build a RAG chatbot over your own documents using vector search.', difficulty:'intermediate'},
  {id:'proj-fde', skill:'data-pipelines', title:'Customer Integration Pilot', description:'Pull data from a customer REST API, clean it in a pipeline, and deploy the result in a container.', difficulty:'intermediate'}
] AS j
MATCH (s:Skill {id:j.skill})
MERGE (p:Project {id:j.id}) SET p.title = j.title, p.description = j.description, p.difficulty = j.difficulty
MERGE (s)-[:PRACTICED_BY]->(p);

MATCH (k:Skill)
SET k.estHours = CASE
  WHEN k.category IN ['ML','AI','Architecture'] THEN 30
  WHEN NOT (k)-[:REQUIRES_PREREQUISITE]->() AND k.id IN ['html-css','git','linux'] THEN 15
  ELSE 20 END;
