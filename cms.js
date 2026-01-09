const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory storage for CMS content
const cmsContents = [];

// Helper to slugify title for URL-friendly slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

// Get all published content (optionally include drafts)
router.get('/', (req, res) => {
  const includeDrafts = req.query.includeDrafts === 'true';
  const contents = includeDrafts ? cmsContents : cmsContents.filter(c => c.status === 'published');
  res.json(contents);
});

// Get single content by slug
router.get('/:slug', (req, res) => {
  const content = cmsContents.find(c => c.slug === req.params.slug);
  if (content) {
    res.json(content);
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
});

// Create new content
router.post('/', (req, res) => {
  const { title, content, author, status } = req.body;
  const slug = slugify(title);
  const newContent = {
    id: uuidv4(),
    title,
    slug,
    content,
    author,
    status: status || 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  cmsContents.push(newContent);
  res.status(201).json(newContent);
});

// Update content
router.put('/:slug', (req, res) => {
  const contentItem = cmsContents.find(c => c.slug === req.params.slug);
  if (contentItem) {
    contentItem.title = req.body.title ?? contentItem.title;
    contentItem.slug = slugify(contentItem.title);
    contentItem.content = req.body.content ?? contentItem.content;
    contentItem.author = req.body.author ?? contentItem.author;
    contentItem.status = req.body.status ?? contentItem.status;
    contentItem.updatedAt = new Date();
    res.json(contentItem);
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
});

// Delete content
router.delete('/:slug', (req, res) => {
  const index = cmsContents.findIndex(c => c.slug === req.params.slug);
  if (index !== -1) {
    cmsContents.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Content not found' });
  }
});

module.exports = router;
