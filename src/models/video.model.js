const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const videoSchema = new Schema(
    {
   videoFile: {
     type: String, //string ayega cludinaru url se
     required: true
   },
   thumbnail: {
     type: String, //string ayega cludinaru url se
     required: true
   },
    title: {
      type: String,
      required: true
    
    },
    description: {
      type: String,
        required: true
    },
    duration:{
      type: Number,
      required: true
    },

    views: {
      type: Number,
      default: 0
    },

    isPublieshed: {
      type: Boolean,
      default: true
    },
   
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
},
 { timestamps: true}
);


// now we can write queries joke aggregation queries hai 
videoSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Video", videoSchema);
// export const Video = mongoose.model("Video", videoSchema);

