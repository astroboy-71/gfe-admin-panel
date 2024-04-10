import mongoose from "mongoose"

const proposalSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topics",
      unique: true,
    },
    summary: {
      type: String,
      required: true,
    },
    actions: {
      type: [
        {
          type: {
            type: String,
            enum: ["WITHDRAW", "MINT"],
            required: true,
          },
          recipient: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

export default mongoose.models?.Proposals ||
  mongoose.model("Proposals", proposalSchema)
