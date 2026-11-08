import * as v from 'valibot'

export const CreateCartSchema = v.object({
    variant_id: v.pipe(
        v.string(),
        v.transform(Number),
        v.integer(),
        v.minValue(1)
    ),
    count: v.pipe(
        v.string(),
        v.transform(Number),
        v.integer(),
        v.minValue(1)
    )
})

export const DeleteCartEntriesSchema = v.object({
    cartIDs: v.pipe(
        v.string(),
        v.transform((input)=>input.split(',')),
        v.array(v.pipe(v.string(),v.toNumber(),v.integer()))
    )
})

export const EditCartEntriesSchema = v.object({
    id: v.pipe(
        v.string(),
        v.transform(Number),
        v.integer(),
    ),
    count: v.pipe(
        v.string(),
        v.transform(Number),
        v.integer(),
        v.minValue(1)
    )
})
