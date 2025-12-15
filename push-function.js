import { Client, Databases, Messaging } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {

  const client = new Client()
       .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
       .setKey(req.headers['x-appwrite-key']);

  
  const databases = new Databases(client);
  const messaging = new Messaging(client);
  // Get the created document ID from the string databases.cafe.collections.order.documents.682f46c700164c728d6c.create
  const documentId = req.headers['x-appwrite-event'].split('.')[5];
  log('Triggering order: ' + documentId)
  const order = await databases.getDocument('cafe', 'order', documentId);
  log(order)
  // parse the user id from string 'read(\"user:6817b42100095a211cf0\")'
  const baristaId = order.cafeId.$permissions[0].split(':')[1].split('"')[0];
  log('Barista ID: ' + baristaId)
  messaging.createPush(
    'unique()',
    `New ${order.item.name} order received !`,
    `From ${order.clientName}`,
    [],
    [baristaId]
  )

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};