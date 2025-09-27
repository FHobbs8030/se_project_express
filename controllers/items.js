export async function likeItem(req,res,next){
  try {
    const doc = await Item.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!doc) return res.status(404).send({ message: 'Item not found' });
    res.send(doc);
  } catch(e){ next(e); }
}

export async function unlikeItem(req,res,next){
  try {
    const doc = await Item.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!doc) return res.status(404).send({ message: 'Item not found' });
    res.send(doc);
  } catch(e){ next(e); }
}
